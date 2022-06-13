let conf = ./test.dhall

in      conf
    //  { sources = conf.sources # [ "stories/**/*.purs" ]
        , dependencies = conf.dependencies # [ "avar" ]
        }
