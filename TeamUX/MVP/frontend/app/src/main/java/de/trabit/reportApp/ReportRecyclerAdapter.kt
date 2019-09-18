package de.trabit.reportApp

import android.content.Context
import android.content.Intent
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import kotlinx.android.synthetic.main.report_item.view.*
import kotlin.collections.ArrayList

//Adapter Class to adapt the Recyclerview with the Layout

class ReportRecyclerAdapter(val reportList: ArrayList<ReportItem>) : RecyclerView.Adapter<ReportRecyclerAdapter.ViewHolder>()
{


    override fun onCreateViewHolder(p0: ViewGroup, p1: Int): ViewHolder {
        val v = LayoutInflater.from(p0?.context).inflate(R.layout.report_item, p0, false)
        return ViewHolder(v)

    }

    override fun onBindViewHolder(p0: ViewHolder, p1: Int) {
        val report : ReportItem = reportList[p1]
        p0?.day_text?.text = report.dayText
        p0?.time_text?.text = report.timeText
        p0?.username_text?.text = report.usernameText
        p0?.id_text?.text =report.idText
        p0?.report_text?.text = report.reportText

    }


    override fun getItemCount(): Int {
       return reportList.size
    }


    class ViewHolder (itemView: View) : RecyclerView.ViewHolder(itemView){

        val day_text = itemView.findViewById(R.id.day_text) as TextView
        val time_text = itemView.findViewById(R.id.time_text) as TextView
        val username_text = itemView.findViewById(R.id.username_text) as TextView
        val id_text = itemView.findViewById(R.id.id_text) as TextView
        val report_text = itemView.findViewById(R.id.report_text) as TextView
        val commentIcon = itemView.findViewById(R.id.commentIcon) as ImageView

        init {
            itemView.commentIcon.setOnClickListener {

                val commentsIntent = Intent(itemView.context, CommentsActivity::class.java)
                itemView.context.startActivity(commentsIntent)
            }

        }

    }



}