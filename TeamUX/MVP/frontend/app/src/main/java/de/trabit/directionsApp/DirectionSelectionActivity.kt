package de.trabit.directionsApp

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.TextView
import de.trabit.directionsApp.requestHelper.RequestActivity
import de.trabit.reportApp.BuildConfig
import de.trabit.reportApp.R
import org.json.JSONArray
import org.json.JSONObject





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

        var origin = JSONObject()
        origin.put("lat", originLat)
        origin.put("lng", originLong)

        var destination = JSONObject()
        destination.put("lat", destinationLat)
        destination.put("lng", destinationLong)

        val text = findViewById<TextView>(R.id.textView)
        text.setText(timestamp.toString() + " " + originLat.toString() + " " + originLong.toString() + " " + destinationLat.toString() + " " + destinationLong.toString())


        //POST Mobilities with current location
        var requestBodyM = JSONObject()
        requestBodyM.put("lat", 50.941357)
        requestBodyM.put("lng", 6.958307)
        requestBodyM.put("radius", 2000)


        val asyncPostForMobilites = RequestActivity.PostRequestWithOneID(getApplicationContext(),"mobilities", BuildConfig.DEMO_USERID_MONGODB , requestBodyM.toString())
        asyncPostForMobilites.execute()
        Log.i("TAG", asyncPostForMobilites.get().toString())


        //POST DirectionsSelections with MobilitesID
        var requestBodyDS = JSONObject()
        requestBodyDS.put("origin", origin)
        requestBodyDS.put("destination", destination)
        requestBodyDS.put("departureTime", timestamp)


        val asyncPost = RequestActivity.PostRequest(getApplicationContext(),"directionsSelections", BuildConfig.DEMO_USERID_MONGODB , asyncPostForMobilites.get().toString(), requestBodyDS.toString())
        asyncPost.execute()
        Log.i("TAG", asyncPost.get().toString())


        val asyncGet2 = RequestActivity.GetRequest(getApplicationContext(), "directionsSelections", asyncPost.get().toString())
        asyncGet2.execute()

        var selectionOne: JSONObject = asyncGet2.get().getJSONObject("data").getJSONArray("selections").getJSONArray(0).getJSONObject(0)
        var selectionTwo: JSONObject = asyncGet2.get().getJSONObject("data").getJSONArray("selections").getJSONArray(0).getJSONObject(1)

        Log.i("TAG", selectionOne.toString())
        Log.i("TAG", selectionTwo.toString())



    }
}
