package de.trabit.reportApp

import ErrorSnackbar
import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_second_add.*
import android.widget.ArrayAdapter
import androidx.core.app.ComponentActivity
import androidx.core.app.ComponentActivity.ExtraData
import androidx.core.content.ContextCompat.getSystemService
import android.icu.lang.UCharacter.GraphemeClusterBreak.T


class SecondAddActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_second_add)

        //read out user input from edittext (Id Means of Transport and destination Location)
        val meansOfTransportIdField = findViewById<EditText>(R.id.inputTextNr)
        val meansOfTransportId = meansOfTransportIdField.text
        val destinationLocationField = findViewById<AutoCompleteTextView>(R.id.inputTextDestination)
        val destinationLocation = destinationLocationField.text
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
                    NextActivity(meansOfTransportId, destinationLocation,chosenMeansOfTransport)
                }
            }
            "train" -> {
                imageMeansOfTransport.setImageResource(R.mipmap.train_icon_clicked)
                textMeansOfTransport.text = "Zug"
                confirmBtn.setOnClickListener{
                    NextActivity(meansOfTransportId, destinationLocation,chosenMeansOfTransport)
                }
                }
            "subway"  -> {
                imageMeansOfTransport.setImageResource(R.mipmap.tram_icon_clicked)
                textMeansOfTransport.text = "U-Bahn / Tram"
                confirmBtn.setOnClickListener{
                    NextActivity(meansOfTransportId, destinationLocation,chosenMeansOfTransport)
                }
            }
            "car" -> {
                imageMeansOfTransport.setImageResource(R.mipmap.car_icon_clicked)
                textMeansOfTransport.text = "Auto"
                meansOfTransportIdField.setVisibility(View.GONE)
                confirmBtn.setOnClickListener{
                    NextActivityCar(meansOfTransportId, destinationLocation,chosenMeansOfTransport)
                }
            }
        }

        //close Activity by clicking the x and go back to OverviewActivity
        val closeButton = findViewById<ImageButton>(R.id.closeSecondAddButton)
        closeButton.setOnClickListener{
            val closeIntent = Intent(this,OverviewActivity::class.java)
            startActivity(closeIntent)
        }

        //back Button Intent to FirstAddActivity
        val backBtnToFirstAddActivity = findViewById<ImageButton>(R.id.btn_back)
        backBtnToFirstAddActivity.setOnClickListener{
            val backIntent = Intent(this,FirstAddActivity::class.java)
            startActivity(backIntent)
        }

        // Array of City Names
        val citys = arrayOf(
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
            this, android.R.layout.simple_list_item_1, citys
        )

        destinationLocationField.setAdapter(adapter)
    }

    fun NextActivity (meansOfTransportId : Editable, destinationLocation: Editable, chosenMeansOfTransport: String){
        //add intent to further button to hand off to SecondAddActivity, checking if something is written in the edittext field
            if(meansOfTransportId.isNullOrBlank()||destinationLocation.isNullOrBlank()){
                ErrorSnackbar(linearLayout_secondAdd).show("Bitte fülle zunächst beide Textfelder aus!")
            } else {
                val lastAddActivityIntent = Intent(this, ThirdAddActivity::class.java)
                lastAddActivityIntent.putExtra("meansOfTransport", chosenMeansOfTransport)
                lastAddActivityIntent.putExtra("meansOfTransportId", meansOfTransportId.toString())
                lastAddActivityIntent.putExtra("destinationLocation",destinationLocation.toString())
                startActivity(lastAddActivityIntent)
            }
    }
    fun NextActivityCar (meansOfTransportId : Editable, destinationLocation: Editable, chosenMeansOfTransport: String) {
        //add intent to further button to hand off to SecondAddActivity, checking if something is written in the edittext field
        if (destinationLocation.isNullOrBlank()) {
            ErrorSnackbar(linearLayout_secondAdd).show("Bitte fülle zunächst das Textfeld aus!")
        } else {
            val lastAddActivityIntent = Intent(this, ThirdAddActivity::class.java)
            lastAddActivityIntent.putExtra("meansOfTransport", chosenMeansOfTransport)
            lastAddActivityIntent.putExtra("destinationLocation", destinationLocation.toString())
            startActivity(lastAddActivityIntent)
        }
    }
}


