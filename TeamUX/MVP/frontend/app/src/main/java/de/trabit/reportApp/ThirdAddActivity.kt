package de.trabit.reportApp

import ErrorSnackbar
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.api_test.dataClasses.*
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_overview.*
import kotlinx.android.synthetic.main.activity_third_add.*
import org.json.JSONException
import org.json.JSONObject

class ThirdAddActivity : AppCompatActivity() {
    private lateinit var destinationLat : String
    private lateinit var destinationLng : String

    // create client for location
    private lateinit var fusedLocationClient : FusedLocationProviderClient

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_third_add)

        // get users location data
        var originLat = "51.028351"
        var originLng = "7.565430"
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        fusedLocationClient.lastLocation
            .addOnSuccessListener { location : android.location.Location? ->
                originLat = location?.latitude.toString()
                originLng = location?.longitude.toString()
            }

        //store the value (chosen means of transport and Id) in a variable
        val meansOfTransportName = intent.getStringExtra("meansOfTransport")
        val meansOfTransportId = intent.getStringExtra("meansOfTransportId")
        val destinationLocation = intent.getStringExtra("destinationLocation")
        var reportComment : String

        // get geodata from destination city
        getGeodataFromCity(destinationLocation)

        //Adapt the activity layout to the appropriate means of transport
        val imageMeansOfTransport = findViewById<ImageView>(R.id.imageMeansOfTransport)
        val textMeansOfTransport = findViewById<TextView>(R.id.textMeansOfTransport)

        val textTile1 = findViewById<TextView>(R.id.textTile1)
        val textTile2 = findViewById<TextView>(R.id.textTile2)
        val textTile3 = findViewById<TextView>(R.id.textTile3)
        val textTile4 = findViewById<TextView>(R.id.textTile4)
        // val textTile5 = findViewById<TextView>(R.id.textTile5)
        // val textTile6 = findViewById<TextView>(R.id.textTile6)

        val imageTile1 = findViewById<ImageView>(R.id.imageTile1)
        val imageTile2 = findViewById<ImageView>(R.id.imageTile2)
        val imageTile3 = findViewById<ImageView>(R.id.imageTile3)
        // val imageTile5 = findViewById<ImageView>(R.id.imageTile5)
        // val imageTile6 = findViewById<ImageView>(R.id.imageTile6)

        val tile1 = findViewById<RelativeLayout>(R.id.tile1)
        val tile2 = findViewById<RelativeLayout>(R.id.tile2)
        val tile3 = findViewById<RelativeLayout>(R.id.tile3)
        val tile4 = findViewById<RelativeLayout>(R.id.tile4)
        val tile5 = findViewById<RelativeLayout>(R.id.tile5)
        val tile6 = findViewById<RelativeLayout>(R.id.tile6)

        when (meansOfTransportName) {
            "bus"   -> {
                imageMeansOfTransport.setImageResource(R.mipmap.bus_icon_clicked)
                textMeansOfTransport.text = "Bus"
                textTile1.text = "Verspätung"
                imageTile1.setImageResource(R.mipmap.time_icon)
                textTile2.text = "Entfällt"
                imageTile2.setImageResource(R.mipmap.stop_icon)
                tile3.visibility = View.INVISIBLE
                tile4.visibility = View.INVISIBLE
                tile5.visibility = View.INVISIBLE
                tile6.visibility = View.INVISIBLE
            }
            "train" -> {
                imageMeansOfTransport.setImageResource(R.mipmap.train_icon_clicked)
                textMeansOfTransport.text = "Zug"
                textTile1.text = "Verspätung"
                imageTile1.setImageResource(R.mipmap.time_icon)
                textTile2.text = "Entfällt"
                imageTile2.setImageResource(R.mipmap.stop_icon)
                textTile3.text = "Gleiswechsel"
                imageTile3.setImageResource(R.mipmap.detour_icon)
                tile4.visibility = View.INVISIBLE
                tile5.visibility = View.INVISIBLE
                tile6.visibility = View.INVISIBLE
            }
            "subway"  -> {
                imageMeansOfTransport.setImageResource(R.mipmap.tram_icon_clicked)
                textMeansOfTransport.text = "Bahn"
                textTile1.text = "Verspätung"
                imageTile1.setImageResource(R.mipmap.time_icon)
                textTile2.text = "Entfällt"
                imageTile2.setImageResource(R.mipmap.stop_icon)
                textTile3.text = "Gleiswechsel"
                imageTile3.setImageResource(R.mipmap.detour_icon)
                tile4.visibility = View.INVISIBLE
                tile5.visibility = View.INVISIBLE
                tile6.visibility = View.INVISIBLE
            }
            "car" -> {
                imageMeansOfTransport.setImageResource(R.mipmap.car_icon_clicked)
                textMeansOfTransport.text = "Auto"
                textTile1.text = "Stau"
                imageTile1.setImageResource(R.mipmap.trafficjam_icon)
                textTile2.text = "Umleitung"
                imageTile2.setImageResource(R.mipmap.detour_icon)
                textTile3.text = "Unfall"
                imageTile3.setImageResource(R.mipmap.cone_icon)
                textTile4.text = "Gesperrt"
                imageTile4.setImageResource(R.mipmap.stop_icon)
                tile5.visibility = View.INVISIBLE
                tile6.visibility = View.INVISIBLE
            }
        }

        //close Activity by clicking the x and go back to OverviewActivity
        val closeButton = findViewById<ImageButton>(R.id.closeThirdAddBtn)
        closeButton.setOnClickListener{
            val closeIntent = Intent(this,OverviewActivity::class.java)
            startActivity(closeIntent)
        }

        //back Button Intent to SecondAddActivtiy
        val backBtnToSecondAddActivity = findViewById<ImageButton>(R.id.btn_back3)
        backBtnToSecondAddActivity.setOnClickListener{
            finish()
        }

        // set onClickListener to all tiles and save the value of the chosen tile
        tile1.setOnClickListener{
            reportComment = textTile1.text.toString()
            val report = CreateReport(BuildConfig.DEMO_USERNAME, reportComment, LocationObject(Location(originLat, originLng, null), Location(destinationLat, destinationLng, null)), CreateTransport(meansOfTransportName, meansOfTransportId))
            postReport(report)
        }

        tile2.setOnClickListener{
            reportComment = textTile2.text.toString()
            val report = CreateReport(BuildConfig.DEMO_USERNAME, reportComment, LocationObject(Location(originLat, originLng, null), Location(destinationLat, destinationLng, null)), CreateTransport(meansOfTransportName, meansOfTransportId))
            postReport(report)
        }

        tile3.setOnClickListener{
            reportComment = textTile3.text.toString()
            val report = CreateReport(BuildConfig.DEMO_USERNAME, reportComment, LocationObject(Location(originLat, originLng, null), Location(destinationLat, destinationLng, null)), CreateTransport(meansOfTransportName, meansOfTransportId))
            postReport(report)
        }

        tile4.setOnClickListener{
            reportComment = textTile4.text.toString()
            val report = CreateReport(BuildConfig.DEMO_USERNAME, reportComment, LocationObject(Location(originLat, originLng, null), Location(destinationLat, destinationLng, null)), CreateTransport(meansOfTransportName, meansOfTransportId))
            postReport(report)
        }

        tile5.setOnClickListener{
            reportComment = textTile5.text.toString()
            val report = CreateReport(BuildConfig.DEMO_USERNAME, reportComment, LocationObject(Location(originLat, originLng, null), Location(destinationLat, destinationLng, null)), CreateTransport(meansOfTransportName, meansOfTransportId))
            postReport(report)
        }

        tile6.setOnClickListener{
            reportComment = textTile6.text.toString()
            val report = CreateReport(BuildConfig.DEMO_USERNAME, reportComment, LocationObject(Location(originLat, originLng, null), Location(destinationLat, destinationLng, null)), CreateTransport(meansOfTransportName, meansOfTransportId))
            postReport(report)
        }

        //set onClickListener to the confirm button when the user add a manual comment
        val confirmButton = findViewById<Button>(R.id.btn_send)
        val commentText = findViewById<EditText>(R.id.comment_text)
        confirmButton.setOnClickListener{
            //check if something is typed in the textfield
            if(commentText.text.toString().isBlank()){
                ErrorSnackbar(linearLayout_thirdAdd).show("Bitte gebe einen Beschreibungstext ein oder wähle einen Standardtext aus!")
            } else {
                // create report
                reportComment = commentText.text.toString()
                val report = CreateReport(BuildConfig.DEMO_USERNAME, reportComment, LocationObject(Location(originLat, originLng, null), Location(destinationLat, destinationLng, null)), CreateTransport(meansOfTransportName, meansOfTransportId))
                postReport(report)
            }
        }
    }

    private fun getGeodataFromCity (city : String) {
        val errorMessage = "Geodaten der Ziel-Stadt konnten nicht ermittelt werden!"
        val requestUrl = "https://geocoder.api.here.com/6.2/geocode.json?app_id=${BuildConfig.REPORTAPI_HERE_APPID}&app_code=${BuildConfig.REPORTAPI_HERE_APPCODE}&searchtext=${city}"
        val mQueue: RequestQueue = Volley.newRequestQueue(this)
        val request = JsonObjectRequest(Request.Method.GET, requestUrl, null,
            Response.Listener {
                try {
                    val displayPosition = it.getJSONObject("Response").getJSONArray("View").getJSONObject(0).getJSONArray("Result").getJSONObject(0).getJSONObject("Location").getJSONObject("DisplayPosition")
                    destinationLat = displayPosition.getString("Latitude")
                    destinationLng = displayPosition.getString("Longitude")
                } catch (e: JSONException) {
                    e.printStackTrace()
                    ErrorSnackbar(linearLayout_main).show(errorMessage)
                }
            }, Response.ErrorListener {
                it.printStackTrace()
                ErrorSnackbar(linearLayout_main).show(errorMessage)
            })
        mQueue.add(request)
    }

    private fun postReport(report : CreateReport) {
        val requestUrl = BuildConfig.REPORTAPI_BASE_URL + "reports"
        val reportObject = JSONObject(Gson().toJson(report))
        val mQueue: RequestQueue = Volley.newRequestQueue(this)
        val request = JsonObjectRequest(Request.Method.POST, requestUrl, reportObject,
            Response.Listener {
                try {
                    val addReportIntent = Intent(this, OverviewActivity::class.java)
                    startActivity(addReportIntent.putExtra("reportCreated", true))
                } catch (e: JSONException) {
                    e.printStackTrace()
                    ErrorSnackbar(linearLayout_thirdAdd).show("Störungsmeldung konnte nicht erstellt werden!")
                }
            }, Response.ErrorListener {
                it.printStackTrace()
                val errorMsg = String(it.networkResponse.data, Charsets.UTF_8)
                ErrorSnackbar(linearLayout_thirdAdd).show(errorMsg)
            })
        mQueue.add(request)
    }
}