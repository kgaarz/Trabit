package de.trabit.reportApp.comments

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.api_test.dataClasses.Comment
import de.trabit.reportApp.BuildConfig
import de.trabit.reportApp.R
import de.trabit.reportApp.voting.VotingService
import de.trabit.reportApp.voting.VotingView
import kotlinx.android.synthetic.main.comments_item.view.*
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.ArrayList

//Adapter Class to adapt the CommentsRecyclerview with the Layout
class CommentsRecyclerAdapter(private val commentsList: ArrayList<Comment>) : RecyclerView.Adapter<CommentsRecyclerAdapter.ViewHolder>() {

    override fun onCreateViewHolder(p0: ViewGroup, p1: Int): ViewHolder {
        val v = LayoutInflater.from(p0.context).inflate(R.layout.comments_item, p0, false)
        return ViewHolder(v)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(commentsList[position])
    }

    override fun getItemCount(): Int {
        return commentsList.size
    }

    class ViewHolder (itemView: View) : RecyclerView.ViewHolder(itemView), VotingView {
        val commentDayText = itemView.findViewById(R.id.dayText) as TextView
        val commentTimeText = itemView.findViewById(R.id.timeText) as TextView
        val commentUsernameText = itemView.findViewById(R.id.usernameText) as TextView
        val commentConfirmIndex = itemView.findViewById(R.id.vote_number) as TextView
        val commentText = itemView.findViewById(R.id.commentText) as TextView

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
            itemView.vote_number.text = amount.toString()
        }

        fun bind(comment : Comment) {
            // format date for comment view
            val dateFormatter = SimpleDateFormat("dd.MM.yyyy", Locale.GERMAN)
            val today = Calendar.getInstance()
            val yesterday = Calendar.getInstance()
            yesterday.add(Calendar.DAY_OF_YEAR, -1)
            val commentDate = when (dateFormatter.format(comment.created))
            {
                dateFormatter.format(today.time) -> "Heute"
                dateFormatter.format(today.time) -> "Gestern"
                else -> dateFormatter.format(comment.created)
            }

            // upvote action
            if (comment.metadata.upvotes.users.contains(BuildConfig.DEMO_USERID)) {
                itemView.voteUpButton.setImageResource(R.mipmap.check_positive_blue)
            }
            itemView.voteUpButton.setOnClickListener{
                votingService.addUpvote(comment, BuildConfig.DEMO_USERID)
            }

            // downvote action
            if (comment.metadata.downvotes.users.contains(BuildConfig.DEMO_USERID)) {
                itemView.voteDownButton.setImageResource(R.mipmap.check_negative_blue)
            }
            itemView.voteDownButton.setOnClickListener{
                votingService.addDownvote(comment, BuildConfig.DEMO_USERID)
            }

            // format time for comment view
            val timeFormatter = SimpleDateFormat("HH:mm", Locale.GERMAN)
            val commentTime = timeFormatter.format(comment.created)

            // calculate votes
            val votes = comment.metadata.upvotes.amount - comment.metadata.downvotes.amount

            commentDayText.text = commentDate
            commentTimeText.text = commentTime
            commentUsernameText.text = comment.author
            commentText.text = comment.content
            commentConfirmIndex.text = votes.toString()
        }
    }
}