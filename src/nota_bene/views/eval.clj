;; eval.clj
;; shamelessly copied from raynes/tryclojure on github.

(ns nota-bene.views.eval
  (:use [noir.core :only [defpage]]
      [nota-bene.models.eval :only [eval-request]]
      [clojure.stacktrace :only [root-cause]])
  (:require 
      [noir.response :as resp] 
      [cheshire.core :as json] 
      [clojure.java.io :as io]))

(defpage "/eval.json" {:keys [expr jsonp]}
  (let [{:keys [expr result error message] :as res} (eval-request expr)
    data (if error
           res
           (let [[out res] result]
             {:expr (pr-str expr)
              :result (str out (pr-str res))}))]
    (if jsonp
      (resp/jsonp jsonp data)
      (resp/json data))))

(defn save-workbook [workbook]
  (try 
    (let [
      uuid (workbook :id (str (java.util.UUID/randomUUID)))
      out-path (str "workbooks/" uuid ".cljwb")]
        (do 
          (json/generate-stream (assoc workbook :id uuid) (io/writer out-path)) {:error false :message uuid}))
          (catch Exception e {:error true :message (str (root-cause e))})))

(defpage [:post "/save.json"] {:keys [workbook]}
  (resp/json (save-workbook workbook)))

(defn extract-metadata [file]
  (let [workbook (json/parse-stream (io/reader file))]
    { "id" (workbook "id"), "name" (workbook "name")}))

(defpage [:get "/list.json"] {}
  (let [
    workbooks (map extract-metadata (.listFiles (io/file "workbooks")))]
      (resp/json (into [] workbooks))))

(defpage [:get "/load.json/:id"] { :keys [id]}
  (let [
    file (str "workbooks/" id ".cljwb")
    workbook (json/parse-stream (io/reader file))]
      (resp/json workbook)))
