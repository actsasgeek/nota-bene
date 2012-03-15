(ns nota-bene.views.welcome
  (:require [nota-bene.views.common :as common])
  (:use [noir.core :only [defpage]]
        [hiccup form-helpers page-helpers]))

(defpage "/welcome" []
         (common/layout
           [:p "Welcome to nota-bene"]))

(defpage "/notebook" []
	(common/site-layout
		[:div {:id "toolbar"}]
		[:div {:id "notebook"}
			[:h1 "Notebook"]]
		[:div {:class "clear"}]
		(javascript-tag "nota_bene_init();")))