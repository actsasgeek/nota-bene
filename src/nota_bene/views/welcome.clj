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
		[:div#code
			[:textarea {:id "expr"}]
			[:input {:type "submit", :id "eval", :value "Eval", :name "Eval"}]]
		[:div#results]
		(javascript-tag "nota_bene_init();")))