package de.trabit.reportApp

import android.content.Intent
import android.os.Bundle
import android.widget.ImageButton
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.iid.FirebaseInstanceId
import com.google.firebase.messaging.FirebaseMessaging
import de.trabit.reportApp.reports.display.OverviewActivity
import kotlinx.android.synthetic.main.activity_notificaiton_test.*

class NotificationTestActivity : AppCompatActivity() {
    private var transportType = ""
    private var transportTag = ""
    private var reportId = ""
    private var reportDescription = ""
    private val topic = "RB25"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_notificaiton_test)

//        FirebaseMessaging.getInstance().subscribeToTopic(topic)

        val backButton = findViewById<ImageButton>(R.id.backButton)
        backButton.setOnClickListener {
            startActivity(Intent(this, OverviewActivity::class.java))
        }
    }

    override fun onResume() {
        super.onResume()
        FirebaseInstanceId.getInstance().instanceId.addOnCompleteListener(
            OnCompleteListener { task ->
                if(!task.isSuccessful) return@OnCompleteListener
            }
        )

        if (intent.extras != null) {
            transportType = intent.getStringExtra("transportType")
            transportTag = intent.getStringExtra("transportTag")
            reportId = intent.getStringExtra("reportId")
            reportDescription = intent.getStringExtra("reportDescription")

            txtTransportTag.setText(transportType)
            txtTransportType.setText(transportTag)
            txtReportId.setText(reportId)
            txtReportDescription.setText(reportDescription)
        }
    }
}