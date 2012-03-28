(defproject nota-bene "0.1.0-SNAPSHOT"
            :description "FIXME: write this!"
            :dependencies [[org.clojure/clojure "1.3.0"]
                           [noir "1.2.1"]
                           [clojail "0.5.1"]
                           [org.clojure/java.jdbc "0.1.3"]
                           [cheshire "3.0.0"]
                           [mysql/mysql-connector-java "5.1.6"]]
            :jvm-opts ["-Djava.security.policy=example.policy""-Xmx80M"]
            :main nota-bene.server)

