package de.trabit.reportApp.reports.display

import SuccessSnackbar
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.recyclerview.widget.RecyclerView
import com.example.api_test.dataClasses.Report
import de.trabit.reportApp.BuildConfig
import de.trabit.reportApp.R
import de.trabit.reportApp.voting.VotingService
import de.trabit.reportApp.voting.VotingView
import kotlinx.android.synthetic.main.report_item.view.*
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
            LayoutInflater.from(parent.context).inflate(
                R.layout.report_item,
                parent,
                false
            ), this.onCommentListener
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
        private val dayText = itemView.findViewById(R.id.day_text) as TextView
        private val timeText = itemView.findViewById(R.id.time_text) as TextView
        private val usernameText = itemView.findViewById(R.id.username_text) as TextView
        private val idText = itemView.findViewById(R.id.id_text) as TextView
        private val destinationText =itemView.findViewById(R.id.destination_text) as TextView
        private val reportText = itemView.findViewById(R.id.report_text) as TextView
        private val commentAmount = itemView.findViewById(R.id.commentNumber) as TextView
        private val confirmIndex = itemView.findViewById(R.id.voteNumber) as TextView
        private val verifiedStar = itemView.findViewById(R.id.verifiedStar) as ImageView
        private val reportMenu = itemView.findViewById(R.id.reportOptions) as ImageButton
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
            //set view visible if userId equals to reportitem userId
            if( report.author == BuildConfig.DEMO_USERNAME){
                reportMenu.visibility = View.VISIBLE
            }else{
                reportMenu.visibility = View.INVISIBLE
            }

            //setOnclicklistener to view to open menu and delete Report from database
            reportMenu.setOnClickListener {
                val context: Context = itemView.context
                val popupMenu = PopupMenu(context,it)
                popupMenu.setOnMenuItemClickListener { item ->
                    when(item.itemId){
                        R.id.menu_close_report -> {
                            SuccessSnackbar(itemView).show("Die Störung wurde beendet!")
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
    }

    //Filter function to filter the reportitems concerning to the searchtext from the searchfield (filter idText)
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