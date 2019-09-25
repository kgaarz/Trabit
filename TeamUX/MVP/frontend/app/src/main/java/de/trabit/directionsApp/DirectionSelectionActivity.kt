package de.trabit.directionsApp

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TextView
import de.trabit.directionsApp.requestHelper.RequestActivity
import de.trabit.reportApp.R


class DirectionSelectionActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_direction_selection)

        val intent = intent
        val extras = intent.extras
        val timestamp = extras.getLong("TIMESTAMP")
        val originLat = extras.getDouble("ORIGIN_LAT")
        val originLong = extras.getDouble("ORIGIN_LONG")
        val destinationLat = extras.getDouble("DESTINATION_LAT")
        val destinationLong = extras.getDouble("DESTINATION_LONG")

        val text = findViewById<TextView>(R.id.textView)
        text.setText(timestamp.toString() + " " + originLat.toString() + " " + originLong.toString() + " " + destinationLat.toString() + " " + destinationLong.toString())

        val request = RequestActivity()
        request.getRequest(getApplicationContext(), "traffics", "5d5414fa043e699565a4795e")
    }
}
