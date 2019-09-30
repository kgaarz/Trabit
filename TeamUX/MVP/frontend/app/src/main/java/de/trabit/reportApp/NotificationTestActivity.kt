package de.trabit.reportApp

import android.content.Intent
import android.os.Bundle
import android.widget.EditText
import android.widget.ImageButton
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.iid.FirebaseInstanceId
import de.trabit.reportApp.reports.display.OverviewActivity

class NotificationTestActivity : AppCompatActivity() {
    private var transportType = ""
    private var transportTag = ""
    private var destinationCity = ""
    private var reportId = ""
    private var reportDescription = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_notificaiton_test)

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
            destinationCity = intent.getStringExtra("destinationCity")
            reportId = intent.getStringExtra("reportId")
            reportDescription = intent.getStringExtra("reportDescription")

            val txtTransportTag = findViewById<EditText>(R.id.txtTransportTag)
            val txtTransportType = findViewById<EditText>(R.id.txtTransportType)
            val txtReportId = findViewById<EditText>(R.id.txtReportId)
            val txtReportDescription = findViewById<EditText>(R.id.txtReportDescription)

            txtTransportTag.setText(transportType)
            txtTransportType.setText(transportTag)
            txtReportId.setText(reportId)
            txtReportDescription.setText(reportDescription)
        }
    }
}