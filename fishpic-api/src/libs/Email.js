import AWS from "aws-sdk";

const developerEmails = [ "ashley.j.sands@gmail.com" ];
const senderEmailAddress = "noreply@fishpic.app";

export const sendEmail = async (subject, body, replyToAddresses) => {
    var params = {
        Destination: {
            ToAddresses: developerEmails
        },
        Message: {
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: body
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject 
            }
        },
        Source: senderEmailAddress,
        ReplyToAddresses: replyToAddresses
    };

    const ses = new AWS.SES({apiVersion: '2010-12-01', region: 'us-east-1'});
    return new Promise((resolve, reject) => {
        ses.sendEmail(params, function(err, data) {
            if (err !== null) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const stringifyIgnoringCircularReferences = o => {
    // Attribution: https://stackoverflow.com/a/11616993/137996
    // Note: cache should not be re-used by repeated calls to JSON.stringify.
    var cache = [];
    const str = JSON.stringify(o, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Duplicate reference found
                try {
                    // If this value does not reference a parent it can be deduped
                    return JSON.parse(JSON.stringify(value));
                } catch (error) {
                    // discard key if value cannot be deduped
                    return;
                }
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null;
    return str;
}