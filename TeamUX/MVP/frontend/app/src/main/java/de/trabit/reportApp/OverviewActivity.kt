package de.trabit.reportApp

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.RecyclerView
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView


class OverviewActivity : AppCompatActivity() {


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_overview)

        //init recyclerView

        val recyclerView = findViewById(R.id.recycler_view) as RecyclerView
        recyclerView.layoutManager = LinearLayoutManager(this, LinearLayout.VERTICAL, false)

        //dummydata for the recyclerview

        val reports = ArrayList<ReportItem>()
        reports.add(ReportItem("heute","10.00 Uhr","maxmuster","RB25","Verspätung","2","0"))
        reports.add(ReportItem("heute","09.30 Uhr","milenamuster","RB25","Gleiswechsel","0","2"))
        reports.add(ReportItem("heute","07.30 Uhr","maximmuster","RB25","Die Bahn fährt von Gleis 2, 14 Minuten später ab.","2","0"))
        reports.add(ReportItem("gestern","20.30 Uhr","marlaonmuster","RB25","Verspätung","1","4"))
        reports.add(ReportItem("gestern","15.20 Uhr","miriammuster","RB25","Verspätung","0","2"))

        //add the adapter to the recyclerView

        val adapter = ReportRecyclerAdapter(reports)
        recyclerView.adapter = adapter


        //Add Intent to firstAddActivity to add a report

        val addButton = findViewById(R.id.addButton) as ImageButton

        addButton.setOnClickListener{

            val addReortIntent = Intent(this,FirstAddActivity::class.java)
            startActivity(addReortIntent)

        }


        //Navigation Icons (active mode)

        val overviewIcon = findViewById(R.id.overviewNavigation) as ImageButton
        val profileIcon = findViewById(R.id.profileNavigation) as ImageButton
        val directionsIcon = findViewById(R.id.directonsNavigation) as ImageButton


        overviewIcon.setOnClickListener{
            overviewIcon.setImageResource(R.mipmap.overview_active)
            profileIcon.setImageResource(R.mipmap.profile)
        }

        profileIcon.setOnClickListener{
            profileIcon.setImageResource(R.mipmap.profile_active)
            overviewIcon.setImageResource(R.mipmap.overview)
        }

        directionsIcon.setOnClickListener {
            // Handler code here.
            val intent = Intent(this, DirectionsActivity::class.java)
            startActivity(intent);
        }


        //store the value (choosen city) via Intent from the SearchActivity in a variable
        val manuallyLocationTitle = intent.getStringExtra("newLocation")

        //if a value has been submitted via intent than change the Location Textview accordingly to the passed value from the intent
        if (manuallyLocationTitle !== null){
            var LocationTitle = findViewById(R.id.locationHeader)  as TextView
            LocationTitle.setText(manuallyLocationTitle)
        }

        //Find View By Id for ClickListener Add Clicklistener to Imagebutton (Location) and link to SearchActivity

        var locationBtn = findViewById(R.id.locationChange) as ImageButton

        locationBtn.setOnClickListener{
            val intent = Intent(this,SearchActivity::class.java)
            startActivity(intent)
        }

        //Find Views By Id for ClickListener

        var carBtn = findViewById(R.id.carIcon) as ImageButton
        var trainBtn = findViewById(R.id.trainIcon) as ImageButton
        var tramBtn = findViewById(R.id.tramIcon) as ImageButton
        var busBtn = findViewById(R.id.busIcon) as ImageButton

        //Set the train Button default on clicked

        trainBtn.setImageResource(R.mipmap.train_icon_clicked)

        //Add Clicklistener to Imagebuttons (Car, bus, train, tram icon) to Change Color of Image (Clicked)

        carBtn.setOnClickListener {
            carBtn.setImageResource(R.mipmap.car_icon_clicked)
            trainBtn.setImageResource(R.mipmap.train_icon_grey)
            tramBtn.setImageResource(R.mipmap.tram_icon_grey)
            busBtn.setImageResource(R.mipmap.bus_icon_grey)

        }

        trainBtn.setOnClickListener {
            trainBtn.setImageResource(R.mipmap.train_icon_clicked)
            carBtn.setImageResource(R.mipmap.car_icon_grey)
            tramBtn.setImageResource(R.mipmap.tram_icon_grey)
            busBtn.setImageResource(R.mipmap.bus_icon_grey)
        }

        tramBtn.setOnClickListener {
            tramBtn.setImageResource(R.mipmap.tram_icon_clicked)
            carBtn.setImageResource(R.mipmap.car_icon_grey)
            trainBtn.setImageResource(R.mipmap.train_icon_grey)
            busBtn.setImageResource(R.mipmap.bus_icon_grey)
        }

        busBtn.setOnClickListener {
            busBtn.setImageResource(R.mipmap.bus_icon_clicked)
            carBtn.setImageResource(R.mipmap.car_icon_grey)
            trainBtn.setImageResource(R.mipmap.train_icon_grey)
            tramBtn.setImageResource(R.mipmap.tram_icon_grey)
        }

    }


 }


