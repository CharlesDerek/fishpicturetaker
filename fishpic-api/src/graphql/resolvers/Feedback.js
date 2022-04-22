const uuid = require("uuid");
import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { validateKey } from '../../libs/Auth';
import { sendEmail } from '../../libs/Email';

const FeedbackController = {
	mutationIndex: async (args, context) => {
		validateKey(context.key);
		const feedback = {
			...args.feedback,
			id: uuid.v1(),
			createdDate: new Date().toISOString()
		};
		await createFeedback(feedback); 
		const data = await sendFeedbackEmail(feedback);
		console.log("Sent email. Message Id: " + data.MessageId);
	}
}

async function createFeedback(feedback) {
  const params = {
    TableName: "Feedback",
    Item: feedback
  };

  try {
    await dynamoDbLib.call("put", params);
  } catch (e) {
    console.error("createFeedback: " + e);
  }
}

async function sendFeedbackEmail(feedback) {
	const body = createBody(feedback);
	const replyToEmails = feedback.fields.emailAddress === undefined ? undefined : [ feedback.fields.emailAddress ];
	return await sendEmail("Fishpic User Feedback", body, replyToEmails);
}

function createBody(feedback) {
	return `
Email: ${feedback.fields.emailAddress || ""}
Enjoyment: ${feedback.fields.enjoyment}
Experience: ${feedback.fields.tellMeAboutYourExperience}

Metadata:
IdentityId: ${feedback.identityId}
App Version: ${feedback.appVersion}
Usage Statistics: ${JSON.stringify(feedback.usageStatistics)}
`;
}

module.exports = FeedbackController;
