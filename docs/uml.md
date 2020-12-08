
# Use-Case-Diagram

```plantuml
left to right direction
skinparam packagestyle rectangle
Server as S
actor User as U

rectangle "Corona Dashboard" #azure {
    S -- (Write to DB)
    (Write to DB) <.. (Query API): <<include>>
    (Query API) -- S
    
    U -- (Show Table)
    (Show Table) <.. (Query DB): <<extend>>
    U -- (Show Diagrams)
    
    (Show Diagrams) <.. (Query DB): <<extend>>
    (Query DB) -- S
    U -- (Show API)
    (Show API) <.. (Query DB): <<extend>>
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

Group #LightBlue Server-API Communication
WebServer -> "RKI API": GET
activate WebServer
activate Client
activate "RKI API"
"RKI API" --> WebServer: SEND
deactivate "RKI API"
activate Database
WebServer -> Database: REPLACE INTO
end

Group #LightBlue Client-Server Communication
activate Client
Client -> WebServer: GET
WebServer -> Database: SELECT
Database --> WebServer: Data
WebServer -> WebServer: Calculations
deactivate Database 
WebServer --> Client: SEND
deactivate WebServer
Client -> Client: Visualize
end
```
