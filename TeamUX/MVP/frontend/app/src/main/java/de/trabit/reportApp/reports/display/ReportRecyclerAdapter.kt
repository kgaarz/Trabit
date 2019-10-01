package de.trabit.reportApp.reports.display

import ErrorSnackbar
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.core.content.ContextCompat.startActivity
import androidx.recyclerview.widget.RecyclerView
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.example.api_test.dataClasses.Report
import de.trabit.reportApp.BuildConfig
import de.trabit.reportApp.R
import de.trabit.reportApp.voting.VotingService
import de.trabit.reportApp.voting.VotingView
import kotlinx.android.synthetic.main.report_item.view.*
import org.json.JSONException
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.ArrayList

//Adapter Class to adapt the ReportsRecyclerview with the Layout
class ReportRecyclerAdapter(var reportList: Array<Report>, private val onCommentListener: OnCommentListener) : RecyclerView.Adapter<ReportRecyclerAdapter.ViewHolder>(), Filterable
{
    //Clone of the reportList to filter the data
    val reportListFull : Array<Report> = reportList
    private var recycleFilter : RecyclerFilter? = null

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        when (holder) {
            is ReportViewHolder -> {
                holder.bind(reportList[position])
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ReportViewHolder(
            LayoutInflater.from(parent.context).inflate(R.layout.report_item, parent, false), this.onCommentListener
        )
    }

    override fun getItemCount(): Int {
       return reportList.size
    }

    open class ViewHolder (itemView: View, private val onCommentListener: OnCommentListener) : RecyclerView.ViewHolder(itemView), View.OnClickListener {
        init {
            itemView.commentIcon.setOnClickListener(this)
        }

        override fun onClick(v: View?) {
            onCommentListener.onCommentClick(adapterPosition)
        }
    }

    interface OnCommentListener {
        fun onCommentClick(position : Int)
    }

    class ReportViewHolder (itemView: View, onCommentListener : OnCommentListener) : ViewHolder(itemView, onCommentListener), VotingView {
        private val dayText = itemView.findViewById<TextView>(R.id.day_text)
        private val timeText = itemView.findViewById<TextView>(R.id.time_text)
        private val usernameText = itemView.findViewById<TextView>(R.id.username_text)
        private val idText = itemView.findViewById<TextView>(R.id.id_text)
        private val destinationText =itemView.findViewById<TextView>(R.id.destination_text)
        private val reportText = itemView.findViewById<TextView>(R.id.report_text)
        private val commentAmount = itemView.findViewById<TextView>(R.id.commentNumber)
        private val confirmIndex = itemView.findViewById<TextView>(R.id.voteNumber)
        private val verifiedStar = itemView.findViewById<ImageView>(R.id.verifiedStar)
        private val reportMenu = itemView.findViewById<ImageButton>(R.id.reportOptions)
        private var reportId : String? = null

        private val votingService = VotingService(itemView,this)

        override fun setUpvote() {
            itemView.voteUpButton.setImageResource(R.mipmap.check_positive_blue)
            itemView.voteDownButton.setImageResource(R.mipmap.check_negative_grey)
        }

        override fun setDownvote() {
            itemView.voteDownButton.setImageResource(R.mipmap.check_negative_blue)
            itemView.voteUpButton.setImageResource(R.mipmap.check_positive_grey)
        }

        override fun unsetUpvote() {
            itemView.voteUpButton.setImageResource(R.mipmap.check_positive_grey)
        }

        override fun unsetDownvote() {
            itemView.voteDownButton.setImageResource(R.mipmap.check_negative_grey)
        }

        override fun setVotes(amount : Number) {
            itemView.voteNumber.text = amount.toString()
        }


        fun bind(report : Report) {
            // show report options menu only to the reports author
            if( report.author == BuildConfig.DEMO_USERNAME){
                reportMenu.visibility = View.VISIBLE
            }else{
                reportMenu.visibility = View.INVISIBLE
            }

            // open report options menu
            reportMenu.setOnClickListener {
                val popupMenu = PopupMenu(itemView.context, it)
                popupMenu.setOnMenuItemClickListener { item ->
                    when(item.itemId){
                        R.id.menu_close_report -> {
                            deleteReport(report)
                            true
                        }else -> false
                    }
                }
                popupMenu.inflate(R.menu.reports_menu)
                popupMenu.show()
            }

            // format date for report view
            val dateFormatter = SimpleDateFormat("dd.MM.yyyy", Locale.GERMAN)
            val today = Calendar.getInstance()
            val yesterday = Calendar.getInstance()
            yesterday.add(Calendar.DAY_OF_YEAR, -1)
            val reportDate = when (dateFormatter.format(report.created))
                                    {
                                        dateFormatter.format(today.time) -> "Heute"
                                        dateFormatter.format(today.time) -> "Gestern"
                                        else -> dateFormatter.format(report.created)
                                    }

            // upvote action
            if (report.metadata.upvotes.users.contains(BuildConfig.DEMO_USERID)) {
                itemView.voteUpButton.setImageResource(R.mipmap.check_positive_blue)
            }
            itemView.voteUpButton.setOnClickListener{
                votingService.addUpvote(report, BuildConfig.DEMO_USERID)
            }

            // downvote action
            if (report.metadata.downvotes.users.contains(BuildConfig.DEMO_USERID)) {
                itemView.voteDownButton.setImageResource(R.mipmap.check_negative_blue)
            }
            itemView.voteDownButton.setOnClickListener{
                votingService.addDownvote(report, BuildConfig.DEMO_USERID)
            }

            // format time for report view
            val timeFormatter = SimpleDateFormat("HH:mm", Locale.GERMAN)
            val reportTime = timeFormatter.format(report.created)

            // calculate votes
            val votes = report.metadata.upvotes.amount - report.metadata.downvotes.amount

            // fill report params in layout elements
            dayText.text = reportDate
            timeText.text = reportTime
            usernameText.text = report.author
            idText.text = report.transport.tag
            destinationText.text = report.location.destination.city
            reportText.text = report.description
            commentAmount.text = report.comments.size.toString()
            confirmIndex.text = votes.toString()
            reportId = report._id
            if (report.metadata.verified) {
                verifiedStar.visibility = View.VISIBLE
            }
        }

        private fun deleteReport(report : Report) {
            val requestUrl = BuildConfig.REPORTAPI_BASE_URL + "reports/${report._id}"
            val mQueue: RequestQueue = Volley.newRequestQueue(itemView.context)
            val request = StringRequest(Request.Method.DELETE, requestUrl,
                Response.Listener {
                    try {
                        val deleteReportIntent = Intent(itemView.context, OverviewActivity::class.java)
                        deleteReportIntent
                            .putExtra("reportDeleted", true)
                            .putExtra("reportTransportType", report.transport.type)
                        startActivity(itemView.context, deleteReportIntent, null)
                    } catch (e: JSONException) {
                        e.printStackTrace()
                        ErrorSnackbar(itemView).show("Störung konnte nicht beendet werden!")
                    }
                }, Response.ErrorListener {
                    it.printStackTrace()
                    val errorMsg = String(it.networkResponse.data, Charsets.UTF_8)
                    ErrorSnackbar(itemView).show(errorMsg)
                })
            mQueue.add(request)
        }
    }

    // filter the reportitems by searchtext from the searchfield (filter idText)
    override fun getFilter(): Filter {
        if(recycleFilter == null){
            recycleFilter = RecyclerFilter()
        }
        return recycleFilter as RecyclerFilter
    }

    inner class RecyclerFilter : Filter(){
        override fun performFiltering(constraint: CharSequence?): FilterResults {
            val results = FilterResults()
            if (!constraint.isNullOrBlank()) {
                val localList: ArrayList<Report> = ArrayList<Report>()
                for (r: Report in reportList) {
                    if (r.transport.tag.toLowerCase(Locale.GERMAN).contains(
                            constraint.toString().toLowerCase(Locale.GERMAN).trim())) {
                        localList.add(r)
                    }
                }
                results.values = localList
                results.count = localList.size
             } else {
                results.values = reportListFull
                results.count = reportListFull.size
            }
            return results
        }

        override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
            reportList = results?.values as Array<Report>
            notifyDataSetChanged()
        }
    }
}