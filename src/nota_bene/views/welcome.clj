(ns nota-bene.views.welcome
  (:require [nota-bene.views.common :as common])
  (:use [noir.core :only [defpage]]
        [hiccup form-helpers page-helpers]))

(defpage "/" []
	(common/site-layout
		[:div {:id "toolbar"}
			[:div {:class "header"} "Nota Bene" ]]
		[:div {:id "workbook"}]
		(javascript-tag "nota_bene_init();")))
