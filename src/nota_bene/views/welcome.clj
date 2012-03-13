(ns nota-bene.views.welcome
  (:require [nota-bene.views.common :as common])
  (:use [noir.core :only [defpage]]
        [hiccup form-helpers page-helpers]))

(defpage "/welcome" []
         (common/layout
           [:p "Welcome to nota-bene"]))

(defpage "/notebook" []
	(common/site-layout
		[:h1 "Notebook"]
		[:table {:id "notebook" :style "width: 100%;"}
			[:tr {:class "active-code"}
				[:td [:textarea]]]]
		(javascript-tag "nota_bene_init();")))