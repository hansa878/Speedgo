const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendNotificationOnCreate = functions.firestore
  .document("notifications/{notifId}")
  .onCreate(async (snap, ctx) => {
    const data = snap.data();

    const payload = {
      notification: {
        title: data.title,
        body: data.body
      },
      data: {
        sentBy: "admin"
      }
    };

    // Example: send to topic "all"
    let target = "/topics/all";
    if (data.target === "drivers") target = "/topics/drivers";
    if (data.target === "users") target = "/topics/users";

    try {
      const resp = await admin.messaging().sendToTopic(target, payload);
      console.log("Sent", resp);

      await snap.ref.update({
        sent: true,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.error("FCM error", err);
    }
  });
