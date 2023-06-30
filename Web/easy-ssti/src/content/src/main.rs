use std::env;
use actix_web::{HttpServer, get, post, Responder, HttpResponse, App};
use tera::{Context, Tera};

#[get("/")]
async fn get() -> impl Responder {
    HttpResponse::MethodNotAllowed().body("use posts' raw data to SSTI!")
}

#[post("/")]
async fn post(content: String) -> impl Responder {
    let mut data=Context::new();
    let mut tera = Tera::default();
    let mut content = &content;
    let rendered;
    if !(content.contains("{{")||content.contains("}}")||content.len()>200) {
        rendered = match tera.render_str(content,&data){
            Ok(thing) => thing,
            Err(_) => "Err occurs while rendering".to_string(),
        };
        HttpResponse::Ok().body(rendered)
    }
    else {
        rendered = tera.render_str("forbidden",&data).unwrap();
        HttpResponse::Ok().body("fobbidden!")
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env::set_var("secret","flag{RUSt_1S_S0_1NTere4T1NG}");
    HttpServer::new(||{
        App::new()
            .service(get)
            .service(post)
    })
        .bind("0.0.0.0:8888")?
        .run()
        .await
}
