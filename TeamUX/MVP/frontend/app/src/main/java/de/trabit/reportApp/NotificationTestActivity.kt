package de.trabit.reportApp

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.iid.FirebaseInstanceId
import de.trabit.directionsApp.MapActivity
import de.trabit.directionsApp.requestHelper.RequestActivity
import de.trabit.reportApp.reports.display.OverviewActivity
import org.json.JSONObject

class NotificationTestActivity : AppCompatActivity() {
    private var transportType = ""
    private var transportTag = ""
    private var destinationCity = ""
    private var reportId = ""
    private var reportDescription = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_notificaiton_test)

        val intentForMap = Intent(this, MapActivity::class.java)

        val backButton = findViewById<ImageButton>(R.id.backButton)
        backButton.setOnClickListener {
            startActivity(Intent(this, OverviewActivity::class.java))
        }

        val alternativeRouteBtn: Button = findViewById(R.id.generateAlternativeRouteBtn) as Button
        alternativeRouteBtn.setOnClickListener(object : View.OnClickListener {
            override fun onClick(v: View) {
                val extras = Bundle()
                extras.putString("MOBILITIES_ID", "5d921d2936b0b100048798b5")
                extras.putString("DIRECTIONS_ID", "5d921d2e36b0b100048798b7")

                intentForMap.putExtras(extras)

                startActivity(intentForMap)
            }
        })
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

            val linie = findViewById<TextView>(R.id.linieInput1)
            val richtung = findViewById<TextView>(R.id.richtungInput1)
            val beschreibung = findViewById<TextView>(R.id.beschreibungInput1)


            linie.setText(transportTag)
            richtung.setText(destinationCity)
            beschreibung.setText(reportDescription)
        }
    }
}