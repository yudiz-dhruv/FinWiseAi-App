import { GoogleGenAI, Type } from "@google/genai";
import { LoanFormData, BankOffer, Showroom, LoanType, CarRecommendation, GoldRates } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 1. Generate Bank Offers
export const fetchBankOffers = async (data: LoanFormData): Promise<{ offers: BankOffer[], advice: string, recommendedCars?: CarRecommendation[] }> => {
  const isCarLoan = data.loanType.includes('Car');
  
  // Calculate Totals
  const totalOtherIncome = data.otherIncomes.reduce((sum, item) => sum + item.amount, 0);
  const totalMonthlyIncome = data.primaryIncome + totalOtherIncome;
  
  const estimatedNewEMI = (data.loanAmount * 0.09) / 12; 
  const totalObligations = data.existingEMI + estimatedNewEMI;
  const dtiRatio = (totalObligations / totalMonthlyIncome) * 100;
  
  const prompt = `
    Act as a friendly, street-smart Indian financial advisor (Desi style).
    
    User Profile:
    - Type: ${data.employmentType}
    - Primary Income Proof: ${data.incomeSource}
    - Monthly Primary Income: ₹${data.primaryIncome}
    - Other Incomes: ${data.otherIncomes.map(i => `${i.source}: ₹${i.amount}`).join(', ') || 'None'}
    - Total Monthly Income: ₹${totalMonthlyIncome}
    - Existing EMI Burden: ₹${data.existingEMI}
    - CIBIL Score: ${data.cibilScore || 'Not Provided (Assume average ~700-750)'}
    
    Loan Request:
    - Type: ${data.loanType} ${data.customLoanType ? `(${data.customLoanType})` : ''}
    - Principal Amount: ₹${data.loanAmount}
    ${data.downPayment ? `- Down Payment Ready: ₹${data.downPayment}` : ''}
    - Duration: ${data.durationMonths} months
    - Calculated DTI Ratio: ${dtiRatio.toFixed(1)}%

    Task:
    1. Generate 3 realistic bank/vendor offers suitable for the Indian market.
       - If "Self-Employed" and source is "Turnover", suggest banks like Kotak, IDFC, or NBFCs.
       - If CIBIL is high (>750), suggest HDFC/SBI/ICICI with lower rates.
       - IMPORTANT: Provide a valid 'officialWebUrl' for each bank's loan application page (e.g., https://www.hdfcbank.com/personal/borrow/popular-loans/car-loan).
    2. Provide "Desi Financial Advice" (max 80 words).
       - Use friendly Indian English language (e.g., "Bhai", "Listen na", "Market standard").
       - Be practical. If DTI is high, warn them about "EMI trap".
       - If they have a down payment, appreciate it.
    3. Ensure interest rates are realistic for the current Indian economy.
    
    ${isCarLoan ? `4. Suggest 3 specific popular Indian car models that fit this budget (Principal + Down Payment approx). 
       - Include On-Road Price, Mileage, Fuel Type.` : ''}

    Output as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            offers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  bankName: { type: Type.STRING },
                  interestRate: { type: Type.NUMBER, description: "Annual interest rate in %" },
                  processingFee: { type: Type.STRING, description: "Processing fee in INR or %" },
                  maxTenure: { type: Type.STRING },
                  features: { type: Type.ARRAY, items: { type: Type.STRING } },
                  matchScore: { type: Type.NUMBER, description: "Suitability score out of 100" },
                  officialWebUrl: { type: Type.STRING, description: "URL to apply" }
                }
              }
            },
            advice: { type: Type.STRING },
            recommendedCars: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  modelName: { type: Type.STRING },
                  price: { type: Type.STRING, description: "Approx on-road price in INR" },
                  mileage: { type: Type.STRING, description: "ARAI Mileage" },
                  category: { type: Type.STRING },
                  fuelType: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No data returned from AI");
  } catch (error) {
    console.error("Error fetching bank offers:", error);
    return {
      offers: [],
      advice: "Bhai, servers are busy right now. Try again in a bit!"
    };
  }
};

// 2. Find Nearby Showrooms (Cars or Jewellery)
export const findNearbyShowrooms = async (
  lat: number,
  lng: number,
  loanAmount: number,
  loanType: string
): Promise<Showroom[]> => {
  if (!loanType.includes('Car') && !loanType.includes('Gold')) return [];

  let segment = "";
  if (loanType.includes('Gold')) {
     segment = "Trusted Jewellery Showrooms like Tanishq, Kalyan Jewellers, Malabar Gold";
  } else {
    // Car Logic
    if (loanAmount > 3000000) segment = "Mercedes, BMW or Audi Car Showroom";
    else if (loanAmount > 1500000) segment = "Tata, Mahindra or Toyota Car Showroom";
    else segment = "Maruti Suzuki or Hyundai Car Showroom";
  }

  const prompt = `Find top rated ${segment} near me in India. Return a list of names and addresses.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const showrooms: Showroom[] = [];

    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.maps) {
          showrooms.push({
            name: chunk.maps.title,
            address: chunk.maps.placeId,
            rating: "4.5",
            user_ratings_total: 0,
            sourceUri: chunk.maps.uri
          });
        }
      });
    }
    
    const uniqueShowrooms = Array.from(new Map(showrooms.map(item => [item.sourceUri, item])).values());
    return uniqueShowrooms.slice(0, 5); 

  } catch (error) {
    console.error("Error finding showrooms:", error);
    return [];
  }
};

// 3. Fetch Real-time Gold Rates
export const fetchGoldRates = async (): Promise<GoldRates | null> => {
    const prompt = `What are the current gold rates (22k and 24k per 10g) and silver rate (per 1kg) in India today?`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', // Using 3-flash with tools for better reasoning + search
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        gold22k: { type: Type.STRING, description: "Current price of 22k gold per 10g in INR" },
                        gold24k: { type: Type.STRING, description: "Current price of 24k gold per 10g in INR" },
                        silver1kg: { type: Type.STRING, description: "Current price of Silver per 1kg in INR" },
                        location: { type: Type.STRING, description: "City or Region for these rates" }
                    }
                }
            }
        });

        if (response.text) {
             return JSON.parse(response.text);
        }
        return null;
    } catch (e) {
        console.error("Error fetching gold rates", e);
        return null;
    }
}
