(ns nota-bene.server
  (:require 
  	[noir.server :as server]
  	[cheshire.core :as json]))

(server/load-views "src/nota_bene/views/")

(comment 
(defn logger [handler]
	(fn [request]
		(let [
			response (handler request)
			body (slurp (:body request))]
			(println request)
			(println body)
				response)))

(server/add-middleware logger))

(defn workbook [handler]
  (fn [req]
    (let [
    	neue (if (= "application/json" (get-in req [:headers "content-type"]))
    		(update-in req [:params] assoc :workbook (json/parse-string (slurp (:body req)) true))
    		req)]
      (handler neue))))

(server/add-middleware workbook)

(defn -main [& m]
  (let [mode (keyword (or (first m) :dev))
        port (Integer. (get (System/getenv) "PORT" "8080"))]
    (server/start port {:mode mode
                        :ns 'nota-bene})))

