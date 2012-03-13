(ns nota-bene.views.common
  (:use [noir.core :only [defpartial]]
        [hiccup form-helpers page-helpers]))

(defpartial layout [& content]
            (html5
              [:head
               [:title "nota-bene"]
               (include-css "/css/reset.css")]
              [:body
               [:div#wrapper
                content]]))

(defpartial site-layout [& content]
	(html5
		[:head
            (include-css "/css/nota-bene.css")
			(include-js "/js/jquery-1.4.2.min.js")
			(include-js "/js/nota-bene.js")
			[:title "Nota Bene"]]
		[:body
			[:div#wrapper
				content]]))