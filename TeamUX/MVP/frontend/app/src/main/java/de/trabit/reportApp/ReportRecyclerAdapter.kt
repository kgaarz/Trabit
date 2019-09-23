package de.trabit.reportApp

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.recyclerview.widget.RecyclerView
import com.example.api_test.dataClasses.Report
import kotlinx.android.synthetic.main.report_item.view.*
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.ArrayList


//Adapter Class to adapt the ReportsRecyclerview with the Layout
class ReportRecyclerAdapter(var reportList: Array<Report>) : RecyclerView.Adapter<ReportRecyclerAdapter.ViewHolder>(), Filterable
{
    //Clone of the reportList to filter the data
    val reportListFull : Array<Report> = reportList
    private var recycleFilter : RecyclerFilter? = null


    override fun onCreateViewHolder(p0: ViewGroup, p1: Int): ViewHolder {
        val v = LayoutInflater.from(p0.context).inflate(R.layout.report_item, p0, false)
        return ViewHolder(v)
    }

    override fun onBindViewHolder(p0: ViewHolder, position: Int) {
        val report = reportList[position]

        // format date for report view
        val dateFormatter = SimpleDateFormat("dd.MM.YYYY")
        val today = Calendar.getInstance()
        val yesterday = Calendar.getInstance()
        yesterday.add(Calendar.DAY_OF_YEAR, -1)
        val reportDate = when (dateFormatter.format(report.created))
                                {
                                    dateFormatter.format(today.time) -> "Heute"
                                    dateFormatter.format(today.time) -> "Gestern"
                                    else -> dateFormatter.format(report.created)
                                }

        // format time for report view
        val timeFormatter = SimpleDateFormat("HH:MM")
        val reportTime = timeFormatter.format(report.created)

        // calculate votes
        val votes = report.metadata.upvotes - report.metadata.downvotes

        // fill report params in layout elements
        p0.day_text.text = reportDate
        p0.time_text.text = reportTime
        p0.username_text.text = report.author
        p0.id_text.text = report.transport.tag
        p0.report_text.text = report.description
        p0.comment_amount.text = report.comments.size.toString()
        p0.confirm_index.text = votes.toString()
        p0.report_id = report.id
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
        val comment_amount = itemView.findViewById(R.id.commentNumber) as TextView
        val confirm_index = itemView.findViewById(R.id.voteNumber) as TextView
        var report_id : String? = null


        init {
            itemView.commentIcon.setOnClickListener{
                val commentsIntent = Intent(itemView.context, CommentsActivity::class.java)
                commentsIntent.putExtra("reportId", report_id )
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

    //Filter function to filter the reportitems concerning to the searchtext from the searchfield (filter idText)
    override fun getFilter(): Filter {
        if(recycleFilter == null){
            recycleFilter = RecyclerFilter()
        }
        return recycleFilter as RecyclerFilter
    }

    inner class RecyclerFilter : Filter(){
        override fun performFiltering(p0: CharSequence?): FilterResults {
            val results = FilterResults()
            if (p0 != null && p0.isNotEmpty()) {
                val localList: ArrayList<Report> = ArrayList<Report>()
                for (i: Int in 0..reportListFull.size.minus(1)) {
                    if (reportListFull.get(i).transport.tag.toLowerCase().contains(p0.toString().toLowerCase().trim())){
                        localList.add(reportListFull.get(i))
                    }
                }
                results.values = localList
                results.count = localList.size
             }else {
                results.values = reportListFull
                results.count = reportListFull.size
            }
            return results
        }

        override fun publishResults(p0: CharSequence?, p1: FilterResults?) {
            reportList = p1?.values as Array<Report>
            notifyDataSetChanged()
        }
    }
}

