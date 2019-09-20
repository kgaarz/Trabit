package de.trabit.reportApp

import android.content.Context
import android.content.Intent
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.Menu
import android.view.View
import android.view.ViewGroup
import android.widget.*
import kotlinx.android.synthetic.main.report_item.view.*
import kotlin.collections.ArrayList

//Adapter Class to adapt the ReportsRecyclerview with the Layout

class ReportRecyclerAdapter(var reportList: ArrayList<ReportItem>) : RecyclerView.Adapter<ReportRecyclerAdapter.ViewHolder>(), Filterable
{

    //Clone of the reportList to filter the data
    val reportListFull :ArrayList <ReportItem> = reportList
    private var recycleFilter : RecyclerFilter? = null


    class ViewHolder (itemView: View) : RecyclerView.ViewHolder(itemView){

        val day_text = itemView.findViewById(R.id.day_text) as TextView
        val time_text = itemView.findViewById(R.id.time_text) as TextView
        val username_text = itemView.findViewById(R.id.username_text) as TextView
        val id_text = itemView.findViewById(R.id.id_text) as TextView
        val report_text = itemView.findViewById(R.id.report_text) as TextView
        val comment_amount = itemView.findViewById(R.id.commentNumber) as TextView
        val confirm_index = itemView.findViewById(R.id.voteNumber) as TextView


        init {

            itemView.commentIcon.setOnClickListener{
                val commentsIntent = Intent(itemView.context, CommentsActivity::class.java)
                itemView.context.startActivity(commentsIntent)
            }

            itemView.voteUpButton.setOnClickListener{
                itemView.voteUpButton.setImageResource(R.mipmap.check_positive_blue)
                itemView.voteDownButton.setImageResource(R.mipmap.check_negative_grey)
            }

            itemView.voteDownButton.setOnClickListener{
                itemView.voteDownButton.setImageResource(R.mipmap.check_negative_blue)
                itemView.voteUpButton.setImageResource(R.mipmap.check_positive_grey)
            }


        }

    }

    override fun onCreateViewHolder(p0: ViewGroup, p1: Int): ViewHolder {
        val v = LayoutInflater.from(p0?.context).inflate(R.layout.report_item, p0, false)
        return ViewHolder(v)

    }

    override fun onBindViewHolder(p0: ViewHolder, p1: Int) {
        val report: ReportItem = reportList[p1]
        p0?.day_text?.text = report.dayText
        p0?.time_text?.text = report.timeText
        p0?.username_text?.text = report.usernameText
        p0?.id_text?.text =report.idText
        p0?.report_text?.text = report.reportText
        p0?.comment_amount?.text = report.commentAmount
        p0?.confirm_index?.text = report.confirmIndex
    }


    override fun getItemCount(): Int {
       return reportList.size
    }

    //Filter function to filter the reportitems concerning to the searchtext from the searchfield (filter idText)

    override fun getFilter(): Filter {
        if(recycleFilter == null){
            recycleFilter = RecyclerFilter()
        }
        return recycleFilter as RecyclerFilter
    }

    inner class RecyclerFilter : Filter(){
        override fun performFiltering(p0: CharSequence?): FilterResults {
            var results: FilterResults = FilterResults()
            if (p0 != null && p0.length > 0) {
                var localList: ArrayList<ReportItem> = ArrayList<ReportItem>()
                for (i: Int in 0..reportListFull.size?.minus(1) as Int) {
                    if (reportListFull?.get(i)?.idText?.toLowerCase()?.contains(p0.toString().toLowerCase().trim()) as Boolean){
                        localList.add(reportListFull?.get(i) as ReportItem)
                    }
                }
                results.values = localList
                results.count = localList.size as Int
             }else {
                results.values = reportListFull
                results.count = reportListFull?.size as Int
            }
            return results
        }


        override fun publishResults(p0: CharSequence?, p1: FilterResults?) {
            reportList = p1?.values as ArrayList<ReportItem>
            notifyDataSetChanged()
        }
    }


}

