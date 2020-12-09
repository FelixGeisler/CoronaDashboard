
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

Group #LightBlue Show Table/Diagrams/API
Client -> WebServer: Get /data/:date?/:location?/
activate Client
WebServer -> Database: Select Data
Database --> WebServer: Send Data
WebServer -> WebServer: Calculations
deactivate Database 
WebServer --> Client: Send Data
deactivate WebServer
Client -> Client: Visualize Data\nTable/Diagrams/API
end
deactivate Client
```
