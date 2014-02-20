require "rack-nocache"
use Rack::Nocache
app = Rack::Static.new nil, :urls => [""], :index =>'index.html', :root => "..", :Port => 9090
run app
