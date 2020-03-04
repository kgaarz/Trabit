package de.trabit.reportApp.reports.add

import ErrorSnackbar
import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_second_add.*
import android.widget.ArrayAdapter
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import de.trabit.reportApp.BuildConfig
import de.trabit.reportApp.R
import de.trabit.reportApp.reports.display.OverviewActivity
import org.json.JSONException

class SecondAddActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_second_add)

        //read out user input from edittext (Id Means of Transport and destination Location)
        val meansOfTransportIdField = findViewById<EditText>(R.id.inputTextNr)
        val meansOfTransportId = meansOfTransportIdField.text
        val destinationLocationField = findViewById<AutoCompleteTextView>(R.id.inputTextDestination)
        val confirmBtn = findViewById<Button>(R.id.btn_next)

        //store the value (chosen means of transport) in a variable
        val chosenMeansOfTransport = intent.getStringExtra("meansOfTransport")

        //Adapt the activity layout to the appropriate means of transport
        val imageMeansOfTransport = findViewById<ImageView>(R.id.imageMeansOftransport)
        val textMeansOfTransport = findViewById<TextView>(R.id.textMeansOfTransport)

        when (chosenMeansOfTransport) {
            "bus"   -> {
                imageMeansOfTransport.setImageResource(R.mipmap.bus_icon_clicked)
                textMeansOfTransport.text = "Bus"
                confirmBtn.setOnClickListener{
                    nextActivity(meansOfTransportId, destinationLocationField, chosenMeansOfTransport)
                }
            }
            "train" -> {
                imageMeansOfTransport.setImageResource(R.mipmap.train_icon_clicked)
                textMeansOfTransport.text = "Zug"
                confirmBtn.setOnClickListener{
                    nextActivity(meansOfTransportId, destinationLocationField, chosenMeansOfTransport)
                }
                }
            "subway"  -> {
                imageMeansOfTransport.setImageResource(R.mipmap.tram_icon_clicked)
                textMeansOfTransport.text = "U-Bahn / Tram"
                confirmBtn.setOnClickListener{
                    nextActivity(meansOfTransportId, destinationLocationField,chosenMeansOfTransport)
                }
            }
            "car" -> {
                imageMeansOfTransport.setImageResource(R.mipmap.car_icon_clicked)
                textMeansOfTransport.text = "Auto"
                meansOfTransportIdField.visibility = View.GONE
                confirmBtn.setOnClickListener{
                    nextActivityCar(destinationLocationField, chosenMeansOfTransport)
                }
            }
        }

        //close Activity by clicking the x and go back to OverviewActivity
        val closeButton = findViewById<ImageButton>(R.id.closeSecondAddButton)
        closeButton.setOnClickListener{
            val closeIntent = Intent(this, OverviewActivity::class.java)
            startActivity(closeIntent)
        }

        //back Button Intent to FirstAddActivity
        val backBtnToFirstAddActivity = findViewById<ImageButton>(R.id.btn_back)
        backBtnToFirstAddActivity.setOnClickListener{
            val backIntent = Intent(this, FirstAddActivity::class.java)
            startActivity(backIntent)
        }

        // Array of City Names
        val cities = arrayOf(
            "Gummersbach", "Gundelfingen", "Stuttgart", "Sindelfingen", "Köln", "Hamburg", "Engelskirchen",
            "Düsseldorf", "Dortmund", "Overath", "Kiel", "Sindelfingen", "Berlin","Eschweiler","Aalen", "AAchen", "Aschaffenburg",
            "Bamberg","Berlin","Bruchsal","Calw","Cottbus","Cuxhafen","Crailsheim","Cloppenburg","Darmstadt","Ditzingen","Dresden",
            "Duisburg", "Delbrück", "Eisenach", "Emmendingen","Engen","Eppingen","Erding","Erlangen","Essen","Ettlingen","Euskirchen",
            "Flensburg","Frankfurt am Main","Frankfurt","Frechen","Freising","Freudenstadt","Fulda","Fürth","Füssen","Furtwangen","Füssen",
            "Geisingen","Geislingen","Göppingen","Göttingen","Günzburg","Gütersloh","Haigerloch","Heidelberg","Heilbronn","Herrenberg",
            "Hockenheim","Hornberg","Hückeswagen","Hüfingen","Hürth","Ingolstadt","Immenau","Ingelfingen","Jena","Kaiserslautern","Karlsruhe",
            "Kassel","Kempten","Kierspe","Koblenz","Konstanz","Künzelsau","Landshut","Leipzig","Leonberg","Lindau","Löffingen","Lörrach",
            "Ludwigsburg","Moers","Mosbach","Müllheim","Neuss","Nürnberg","Regensburg","Ravensburg","Rottweil"
        )
        val adapter = ArrayAdapter<String>(
            this, android.R.layout.simple_list_item_1, cities
        )
        destinationLocationField.setAdapter(adapter)
    }

    private fun nextActivity (meansOfTransportId : Editable, destinationLocationField: AutoCompleteTextView, chosenMeansOfTransport: String){
        //add intent to further button to hand off to SecondAddActivity, checking if something is written in the edittext field
            val destinationLocation = destinationLocationField.text
            if(meansOfTransportId.isBlank() || destinationLocation.isBlank()) {
                ErrorSnackbar(linearLayout_secondAdd).show("Bitte fülle zunächst beide Textfelder aus!")
            } else {
                getGeodataFromCityAndProceed(destinationLocation.toString(), chosenMeansOfTransport, meansOfTransportId.toString())
            }
    }
    private fun nextActivityCar (destinationLocationField: AutoCompleteTextView, chosenMeansOfTransport: String) {
        //add intent to further button to hand off to SecondAddActivity, checking if something is written in the edittext field
        val destinationLocation = destinationLocationField.text
        if (destinationLocation.isBlank()) {
            ErrorSnackbar(linearLayout_secondAdd).show("Bitte fülle zunächst das Textfeld aus!")
        } else {
            getGeodataFromCityAndProceed(destinationLocation.toString(), chosenMeansOfTransport, null)
        }
    }

    private fun getGeodataFromCityAndProceed (city : String, meansOfTransport : String, meansOfTransportId : String?) {
        val errorMessage = "Geodaten der Ziel-Stadt konnten nicht ermittelt werden!"
        val requestUrl = "https://geocoder.api.here.com/6.2/geocode.json?app_id=${BuildConfig.REPORTAPI_HERE_APPID}&app_code=${BuildConfig.REPORTAPI_HERE_APPCODE}&searchtext=${city}"
        val mQueue: RequestQueue = Volley.newRequestQueue(this)
        val request = JsonObjectRequest(Request.Method.GET, requestUrl, null,
            Response.Listener {
                try {
                    val displayPosition =it
                        .getJSONObject("Response")
                        .getJSONArray("View")
                        .getJSONObject(0)
                        .getJSONArray("Result")
                        .getJSONObject(0)
                        .getJSONObject("Location")
                        .getJSONObject("DisplayPosition")

                    val lastAddActivityIntent = Intent(this, ThirdAddActivity::class.java)
                    startActivity(lastAddActivityIntent
                        .putExtra("meansOfTransport", meansOfTransport)
                        .putExtra("meansOfTransportId", meansOfTransportId)
                        .putExtra("destinationLat",displayPosition.getString("Latitude"))
                        .putExtra("destinationLng",displayPosition.getString("Longitude"))
                    )
                } catch (e: JSONException) {
                    e.printStackTrace()
                    ErrorSnackbar(linearLayout_secondAdd).show(errorMessage)
                }
            }, Response.ErrorListener {
                it.printStackTrace()
                ErrorSnackbar(linearLayout_secondAdd).show(errorMessage)
            })
        mQueue.add(request)
    }
}


