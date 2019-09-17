package de.trabit.reportApp

import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import kotlinx.android.synthetic.main.report_item.view.*

//Adapter Class to adapt the Recyclerview with the Layout

class ReportRecyclerAdapter : RecyclerView.Adapter<RecyclerView.ViewHolder>(){

    private var items: List<ReportItem> = ArrayList()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
       return ReportViewHolder(
           LayoutInflater.from(parent.context).inflate(R.layout.report_item, parent, false)
       )
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        when(holder){
            is ReportViewHolder ->{
                holder.bind(items.get(position))
            }

        }
    }

    override fun getItemCount(): Int {
       return items.size
    }

    fun submitList(reportList: List<ReportItem>){
        items = reportList
    }

    class ReportViewHolder
    constructor(
        itemView: View
    ): RecyclerView.ViewHolder(itemView){

        val day_text : TextView = itemView.day_text
        val time_text : TextView = itemView.time_text
        val username_text : TextView = itemView.username_text
        val id_text : TextView = itemView.id_text
        val report_text : TextView = itemView.report_text

        fun bind(reportitem: ReportItem){
            day_text.setText(reportitem.dayText)
            time_text.setText(reportitem.timeText)
            username_text.setText(reportitem.usernameText)
            id_text.setText(reportitem.idText)
            report_text.setText(reportitem.reportText)
        }
    }
}