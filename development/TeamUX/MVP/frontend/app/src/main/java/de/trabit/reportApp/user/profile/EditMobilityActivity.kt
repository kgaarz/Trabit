package de.trabit.reportApp.user.profile

import ErrorSnackbar
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.ImageButton
import com.android.volley.NetworkResponse
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.toolbox.HttpHeaderParser
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.google.gson.Gson
import de.trabit.reportApp.BuildConfig
import de.trabit.reportApp.R
import de.trabit.reportApp.user.model.Mobility
import kotlinx.android.synthetic.main.activity_edit_profile_mobilities.*
import org.json.JSONException
import org.json.JSONObject

class EditMobilityActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edit_profile_mobilities)

        //get user mobility data
        val car = intent.getBooleanExtra("car", false)
        val driversLicense = intent.getBooleanExtra("driversLicense", false)
        val bike = intent.getBooleanExtra("bike", false)
        val trainTicket = intent.getBooleanExtra("trainTicket", false)
        val sharing = intent.getBooleanExtra("sharing", false)

        mob1.isChecked = car
        mob2.isChecked = driversLicense
        mob3.isChecked = bike
        mob4.isChecked = trainTicket
        mob5.isChecked = sharing

        //go back to profile screen
        val backToProfile = findViewById<ImageButton>(R.id.btn_back)
        backToProfile.setOnClickListener {
            val backProfileIntent = Intent(this, ProfileActivity::class.java)
            startActivity(backProfileIntent)
        }

        //go back to profile screen after saving new settings
        val backAfterSave = findViewById<Button>(R.id.profileMob_send_button)
        backAfterSave.setOnClickListener {
            putUserMobility(BuildConfig.DEMO_USERID, Mobility(mob1.isChecked, mob2.isChecked, mob3.isChecked, mob4.isChecked, mob5.isChecked))
        }
    }

    private fun putUserMobility(userId: String, mobility: Mobility){
        val requestUrl = BuildConfig.REPORTAPI_BASE_URL + "users/$userId/mobility"
        val mobilityObject = JSONObject(Gson().toJson(mobility))
        val mQueue: RequestQueue = Volley.newRequestQueue(this)
        val request = object : JsonObjectRequest(Method.PUT, requestUrl, mobilityObject,
            Response.Listener {
                try {
                    val saveProfileIntent = Intent(this, ProfileActivity::class.java)
                    startActivity(saveProfileIntent.putExtra("mobilitySaved", true))
                } catch (e: JSONException) {
                    e.printStackTrace()
                    ErrorSnackbar(Layout_mobility_edit).show("Speichern der Änderungen fehlgeschlagen!")
                }
            }, Response.ErrorListener {
                it.printStackTrace()
                val errorMsg = String(it.networkResponse.data, Charsets.UTF_8)
                ErrorSnackbar(Layout_mobility_edit).show(errorMsg)
            }) {
            override fun parseNetworkResponse(response : NetworkResponse) : Response<JSONObject> {
                return if (response.data.isEmpty()) {
                    Response.success(null, HttpHeaderParser.parseCacheHeaders(response))
                } else {
                    super.parseNetworkResponse(response)
                }
            }
        }
        mQueue.add(request)
    }
}
