package de.trabit.directionsApp

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.TextView
import de.trabit.directionsApp.requestHelper.RequestActivity
import de.trabit.reportApp.BuildConfig
import de.trabit.reportApp.R
import org.json.JSONObject









class DirectionSelectionActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_direction_selection)

        val intentForMap = Intent(this, MapActivity::class.java)

        val modesTextView = findViewById<TextView>(R.id.modesInput1)
        val durationTextView = findViewById<TextView>(R.id.durationInput1)
        val distanceTextView = findViewById<TextView>(R.id.distanceInput1)
        val switchesTextView = findViewById<TextView>(R.id.switchesInput1)
        val sustainibilityTextView = findViewById<TextView>(R.id.sustainibilityInput1)
        val modesTextView2 = findViewById<TextView>(R.id.modesInput2)
        val durationTextView2 = findViewById<TextView>(R.id.durationInput2)
        val distanceTextView2 = findViewById<TextView>(R.id.distanceInput2)
        val switchesTextView2 = findViewById<TextView>(R.id.switchesInput2)
        val sustainibilityTextView2 = findViewById<TextView>(R.id.sustainibilityInput2)

        val intent = intent
        val extras = intent.extras
        val timestamp = extras.getLong("TIMESTAMP")
        val originLat = extras.getDouble("ORIGIN_LAT")
        val originLong = extras.getDouble("ORIGIN_LONG")
        val destinationLat = extras.getDouble("DESTINATION_LAT")
        val destinationLong = extras.getDouble("DESTINATION_LONG")

        var origin = JSONObject()
        origin.put("lat", originLat)
        origin.put("lng", originLong)

        var destination = JSONObject()
        destination.put("lat", destinationLat)
        destination.put("lng", destinationLong)

        //POST Mobilities with current location
        var requestBodyM = JSONObject()
        requestBodyM.put("lat", 50.941357)
        requestBodyM.put("lng", 6.958307)
        requestBodyM.put("radius", 2000)


        val asyncPostForMobilites = RequestActivity.PostRequestWithOneID(getApplicationContext(),"mobilities", BuildConfig.DEMO_USERID_MONGODB , requestBodyM.toString())
        asyncPostForMobilites.execute()
        Log.i("TAG", asyncPostForMobilites.get().toString())
        val mobilitiesId = asyncPostForMobilites.get().toString()


        //POST DirectionsSelections with MobilitesID
        var requestBodyDS = JSONObject()
        requestBodyDS.put("origin", origin)
        requestBodyDS.put("destination", destination)
        requestBodyDS.put("departureTime", timestamp)


        val asyncPost = RequestActivity.PostRequest(getApplicationContext(),"directionsSelections", BuildConfig.DEMO_USERID_MONGODB , asyncPostForMobilites.get().toString(), requestBodyDS.toString())
        asyncPost.execute()
        Log.i("TAG", asyncPost.get().toString())
        val directionSelectionId = asyncPost.get().toString()


        val asyncGet2 = RequestActivity.GetRequest(getApplicationContext(), "directionsSelections", asyncPost.get().toString())
        asyncGet2.execute()

        var selectionOne: JSONObject = asyncGet2.get().getJSONObject("data").getJSONArray("selections").getJSONObject(0)
        var selectionTwo: JSONObject = asyncGet2.get().getJSONObject("data").getJSONArray("selections").getJSONObject(1)

        val duration1: Int = selectionOne.getInt("duration") / 60
        val distance1: Int = selectionOne.getInt("distance") / 1000

        modesTextView.setText(selectionOne.getString("modes"))
        durationTextView.setText(duration1.toString() + "min")
        distanceTextView.setText(distance1.toString() + "km")
        switchesTextView.setText(selectionOne.getString("switches"))
        sustainibilityTextView.setText(selectionOne.getString("sustainability"))

        val duration2: Int = selectionTwo.getInt("duration") / 60
        val distance2: Int = selectionTwo.getInt("distance") / 1000

        modesTextView2.setText(selectionTwo.getString("modes"))
        durationTextView2.setText(duration2.toString() + "min")
        distanceTextView2.setText(distance2.toString() + "km")
        switchesTextView2.setText(selectionTwo.getString("switches"))
        sustainibilityTextView2.setText(selectionTwo.getString("sustainability"))

        val button1 = findViewById(R.id.buttonRoute1) as Button
        button1.setOnClickListener(object : View.OnClickListener {
            override fun onClick(v: View) {
                var requestBodyD1 = JSONObject()
                requestBodyD1.put("selection", 0)
                val asyncPostForDirection1 = RequestActivity.PostRequest(getApplicationContext(),"directions", BuildConfig.DEMO_USERID_MONGODB , directionSelectionId, requestBodyD1.toString())
                asyncPostForDirection1.execute()
                Log.i("TAG", asyncPostForDirection1.get().toString())

                val extras = Bundle()
                extras.putString("MOBILITIES_ID", mobilitiesId)
                extras.putString("DIRECTIONS_ID", asyncPostForDirection1.get().toString())

                intentForMap.putExtras(extras)

                startActivity(intentForMap)
            }
        })

        val button2 = findViewById(R.id.buttonRoute2) as Button
        button2.setOnClickListener(object : View.OnClickListener {
            override fun onClick(v: View) {
                var requestBodyD2 = JSONObject()
                requestBodyD2.put("selection", 1)
                val asyncPostForDirection2 = RequestActivity.PostRequest(getApplicationContext(),"directions", BuildConfig.DEMO_USERID_MONGODB , directionSelectionId, requestBodyD2.toString())
                asyncPostForDirection2.execute()
                Log.i("TAG", asyncPostForDirection2.get().toString())

                val extras = Bundle()
                extras.putString("MOBILITIES_ID", mobilitiesId)
                extras.putString("DIRECTIONS_ID", asyncPostForDirection2.get().toString())

                intentForMap.putExtras(extras)

                startActivity(intentForMap)
            }
        })


    }
}
