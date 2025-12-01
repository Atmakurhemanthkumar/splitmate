// /* global process */
// import { GoogleGenerativeAI } from '@google/generative-ai';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const verifyPaymentProof = async (imageUrl, expectedAmount, expenseDate) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

//     const prompt = `
//       Analyze this UPI payment screenshot and extract:
//       1. Transaction amount (numeric value like 1500, 1,500, ₹1,500.00)
//       2. Transaction date (if visible in DD/MM/YYYY or MM/DD/YYYY format)
      
//       IMPORTANT: 
//       - User may have blurred personal info (UPI ID, name, phone) for privacy
//       - Focus ONLY on finding the payment amount and date
//       - Amount could be in formats: ₹1,500.00, 1500, 1,500, 1500.00
//       - Return amount as plain number without currency symbols
      
//       Expected amount: ${expectedAmount}
//       Expense date: ${new Date(expenseDate).toLocaleDateString('en-IN')}
      
//       Return ONLY valid JSON format without any other text:
//       {
//         "extractedAmount": number or null,
//         "extractedDate": "string or null", 
//         "amountMatches": boolean,
//         "dateMatches": boolean,
//         "confidence": "high/medium/low"
//       }
//     `;

//     // Fetch image from Cloudinary URL
//     const imageResponse = await fetch(imageUrl);
//     if (!imageResponse.ok) {
//       throw new Error('Failed to fetch image');
//     }
    
//     // Convert image to base64 for Gemini
//     const arrayBuffer = await imageResponse.arrayBuffer();
//     const base64Image = btoa(
//       new Uint8Array(arrayBuffer).reduce(
//         (data, byte) => data + String.fromCharCode(byte),
//         ''
//       )
//     );

//     const imagePart = {
//       inlineData: {
//         data: base64Image,
//         mimeType: 'image/jpeg'
//       }
//     };

//     const result = await model.generateContent([prompt, imagePart]);
//     const response = await result.response;
//     const text = response.text();
    
//     console.log('Gemini raw response:', text);
    
//     // Clean and parse JSON response
//     const jsonMatch = text.match(/\{[\s\S]*\}/);
//     if (!jsonMatch) {
//       throw new Error('Invalid response format from AI');
//     }
    
//     const verificationResult = JSON.parse(jsonMatch[0]);
    
//     // Calculate amount match (with some tolerance for formatting)
//     const extracted = verificationResult.extractedAmount;
//     const expected = parseFloat(expectedAmount);
//     const amountMatches = extracted && Math.abs(extracted - expected) < 0.01;
    
//     return {
//       success: true,
//       extractedAmount: extracted,
//       extractedDate: verificationResult.extractedDate,
//       amountMatches: amountMatches,
//       dateMatches: verificationResult.dateMatches || false,
//       confidence: verificationResult.confidence || 'medium',
//       isVerified: amountMatches // Only verify if amounts match
//     };

//   } catch (error) {
//     console.error('Gemini verification error:', error);
//     return {
//       success: false,
//       error: error.message,
//       isVerified: false,
//       amountMatches: false
//     };
//   }
// };