import axios from "axios";

//function to send message to slack, takes in payload as parameter

export const sendMessage = async (data) => {
  console.log("sending message..");

  const webhookUrl =
    "https://hooks.slack.com/services/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";

  let res = await axios.post(webhookUrl, JSON.stringify(data), {
    withCredentials: false,
    transformRequest: [
      (data, headers) => {
        delete headers.post["Content-Type"];
        return data;
      },
    ],
  });
};
