package de.trabit.reportApp

import android.view.View
import androidx.core.content.ContextCompat
import com.google.android.material.snackbar.Snackbar

open class TrabitSnackbar (val view : View) {
    open val colorText = ContextCompat.getColor(this.view.context, R.color.colorWhite)
    open val colorBackground = ContextCompat.getColor(this.view.context, R.color.colorLightBlue)
    open val length = Snackbar.LENGTH_LONG

    fun show(message : String) {
        val snackbar = Snackbar.make(this.view, message, length).setAction("OK"){}
        snackbar.view.setBackgroundColor(colorBackground)
        snackbar.setActionTextColor(colorText)
        snackbar.show()
    }
}