use markdown::{CompileOptions, Constructs, Options, ParseOptions};

#[tauri::command]
pub fn md_to_html(md: String) -> String {
    markdown::to_html_with_options(
        md.as_str(),
        &Options {
            compile: CompileOptions {
                allow_dangerous_html: true,
                allow_dangerous_protocol: true,
                ..CompileOptions::default()
            },
            parse: ParseOptions {
                constructs: Constructs {
                    label_start_image: true,
                    ..Constructs::default()
                },
                ..ParseOptions::default()
            },
        },
    )
    .unwrap()
}
