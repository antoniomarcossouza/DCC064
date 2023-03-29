sleep 3

grep CRON /var/log/syslog | awk '$0 >= from' from="$(date -d '1 hour ago' +'%b %e %H:%M:%S')"