import { checkBotId } from "botid/server";

export default async function handler(request: any, response: any) {
  // Check if the request is from a bot
  const verification = await checkBotId();

  if (verification.isBot) {
    return response.status(403).json({
      error: "Bot detected. Access denied.",
    });
  }

  // Process the legitimate request
  if (request.method === "POST") {
    const { body } = request;
    // Your logic here
    return response.status(200).json({
      success: true,
      message: "Checkout successful",
      data: body,
    });
  }

  return response.status(405).end();
}
