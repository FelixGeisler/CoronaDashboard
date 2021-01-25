
# Use-Case-Diagram

```plantuml
left to right direction
skinparam packagestyle rectangle
Server as S
actor User as U

rectangle "Corona Dashboard" #azure {
    S -- (Write to DB)
    
    U -- (Show Table)
    (Show Table) <.. S
    
    U -- (Show Diagrams)
    (Show Diagrams) <.. S

    U -- (Show API)
    (Show API) <.. S
}
```

# Sequence-Diagram

```plantuml
box Client #azure
participant Client
end box

box Server #azure
participant WebServer
participant Database
end box

box APIs #azure
participant "RKI API"
end box

Group #LightBlue Write to DB
WebServer -> "RKI API": Get
activate WebServer
activate "RKI API"
"RKI API" --> WebServer: Send
deactivate "RKI API"
activate Database
WebServer -> Database: Replace into
deactivate WebServer
deactivate Database
end

Group #LightBlue Get GeoData
Client -> WebServer: Get /data/geo/:level/:id?/
activate WebServer
activate Client
WebServer -> Database: Select Data
activate Database
Database --> WebServer: Send Data
deactivate Database 
WebServer -> WebServer: Calculations
WebServer --> Client: Send Data
deactivate WebServer
Client -> Client: Fill DropDown
end
deactivate Client

Group #LightBlue Show Diagrams
Client -> WebServer: Get /data/type/:level/:id/:start/:stop
activate WebServer
activate Client
WebServer -> Database: Select Data
activate Database
Database --> WebServer: Send Data
deactivate Database 
WebServer -> WebServer: Calculations
WebServer --> Client: Send Data
deactivate WebServer
Client -> Client: Visualize Data (bar & line diagram)
end
deactivate Client

Group #LightBlue Show Summary
Client -> WebServer: Get /data/summary/:level/:id/:start/:stop
activate WebServer
activate Client
WebServer -> Database: Select Data
activate Database
Database --> WebServer: Send Data
deactivate Database 
WebServer -> WebServer: Calculations
WebServer --> Client: Send Data
deactivate WebServer
Client -> Client: Visualize Data (summary)
end
deactivate Client

Group #LightBlue Show Table
Client -> WebServer: Get /data/table/:level/:id/:start/:stop/
activate WebServer
activate Client
WebServer -> Database: Select Data
activate Database
Database --> WebServer: Send Data
deactivate Database 
WebServer -> WebServer: Calculations
WebServer --> Client: Send Data
deactivate WebServer
Client -> Client: Visualize Data (table)
end
deactivate Client
```
