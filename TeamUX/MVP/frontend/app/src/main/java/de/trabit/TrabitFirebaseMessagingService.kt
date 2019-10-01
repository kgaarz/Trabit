package de.trabit

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import de.trabit.reportApp.NotificationTestActivity
import de.trabit.reportApp.R


class TrabitFirebaseMessagingService : FirebaseMessagingService() {
    private lateinit var transportType : String
    private lateinit var transportTag : String
    private lateinit var destinationCity : String
    private lateinit var reportId : String
    private lateinit var reportDescription : String
    val CHANNEL_ID = "trabitChannel"

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)

        val intent = Intent(this, NotificationTestActivity::class.java) //TODO: link to alternativeDirectionsActivity
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)

        // get data from incoming message
        if (message.data.isNotEmpty()) {
            reportId = message.data.getValue("reportId")
            transportType = message.data.getValue("transportType")
            transportTag = message.data.getValue("transportTag")
            reportDescription = message.data.getValue("reportDescription")
            destinationCity = message.data.getValue("destinationCity")

            intent
                .putExtra("transportType", transportType)
                .putExtra("transportTag", transportTag)
                .putExtra("destinationCity", destinationCity)
                .putExtra("reportId", reportId)
                .putExtra("reportDescription", reportDescription)

            sendNotification("Störung: $transportTag --> $destinationCity", "Deine Route ist beeinträchtigt!", intent)
        }

    }

    fun sendNotification(title: String, body: String, intent: Intent) {
        // this pendingIntent will be called when there is an incoming message and invoked the predefined intent
        val pendingIntent =
            PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT)

        // create a notification manager
        val notificationManager =
            getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        // implement notification channel
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val trabitChannel = NotificationChannel(
                CHANNEL_ID,
                "Trabit Störungsalarm",
                NotificationManager.IMPORTANCE_HIGH
            )

            trabitChannel.description =
                "Dieser Channel teilt dir Störungen auf deiner Strecke in der Trabit App mit."
            notificationManager.createNotificationChannel(trabitChannel)
        }

        // build a notification
        val notificationBuilder = NotificationCompat.Builder(baseContext, CHANNEL_ID)
            .setSmallIcon(R.drawable.logo_rund)
            .setContentTitle(title)
            .setContentText(body)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

        notificationManager.notify(0, notificationBuilder)
    }
}