package de.trabit.reportApp

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.widget.*
import kotlinx.android.synthetic.main.activity_second_add.*

class SecondAddActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_second_add)

        //store the value (chosen means of transport) in a variable
        val chosenMeansOfTransport = intent.getStringExtra("meansOfTransport")

        //Adapt the activity layout to the appropriate means of transport
        val imageMeansOfTransport = findViewById<ImageView>(R.id.imageMeansOftransport)
        val textMeansOfTransport = findViewById<TextView>(R.id.textMeansOfTransport)

        when (chosenMeansOfTransport) {
            "bus"   -> {
                imageMeansOfTransport.setImageResource(R.mipmap.bus_icon_clicked)
                textMeansOfTransport.text = "Bus"
            }
            "train" -> {
                imageMeansOfTransport.setImageResource(R.mipmap.train_icon_clicked)
                textMeansOfTransport.text = "Zug"
                }
            "subway"  -> {
                imageMeansOfTransport.setImageResource(R.mipmap.tram_icon_clicked)
                textMeansOfTransport.text = "U-Bahn / Tram"
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

        //read out user input from edittext (Id of Means of Transport)
        val meansOfTransportIdButton = findViewById<EditText>(R.id.inputTextNr)
        val meansOfTransportId = meansOfTransportIdButton.text
        val confirmBtn = findViewById<Button>(R.id.btn_next)

        //add intent to further button to hand off to SecondAddActivity, checking if something is written in the edittext field
        confirmBtn.setOnClickListener {
            if(meansOfTransportId.isNullOrBlank()){
                ErrorSnackbar(linearLayout_secondAdd).show("Bitte gebe eine Kennung ein!")
            } else {
                val lastAddActivityIntent = Intent(this, ThirdAddActivity::class.java)
                lastAddActivityIntent.putExtra("meansOfTransport", chosenMeansOfTransport)
                lastAddActivityIntent.putExtra("meansOfTransportId", meansOfTransportId.toString())
                startActivity(lastAddActivityIntent)
            }
        }
    }
}


