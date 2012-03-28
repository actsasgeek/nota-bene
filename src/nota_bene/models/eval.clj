;; eval.clj
;; shamelessly copied from raynes/tryclojure on github.

(ns nota-bene.models.eval
  (:use [clojail.core :only [sandbox]]
        [clojure.stacktrace :only [root-cause]])
  (:require [noir.session :as session])
  (:import java.io.StringWriter
	   java.util.concurrent.TimeoutException))

(defn eval-form [form sbox]
  (with-open [out (StringWriter.)]
    (let [result (sbox form {#'*out* out})]
      {:expr form
       :result [out result]})))

(defn eval-string [expr sbox]
  (let [form (binding [*read-eval* false] (read-string expr))]
    (eval-form form sbox)))

(defn make-sandbox []
  (sandbox #{}
  		:timeout 60000
  		:jvm false
  		:max-defs 10000))

(defn find-sb [old]
  (if-let [sb (get old "sb")]
    old
    (assoc old "sb" (make-sandbox))))

(defn eval-request [expr]
  (try
    (eval-string expr (get (session/swap! find-sb) "sb"))
    (catch TimeoutException _
      {:error true :message "Execution Timed Out!"})
    (catch Exception e
      {:error true :message (str (root-cause e))})))