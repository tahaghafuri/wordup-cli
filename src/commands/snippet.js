const Command =  require('../command-base')
const shell = require('shelljs')
const chalk = require('chalk')
const slugify = require('slugify')

class SnippetCommand extends Command {
  async run() {
    const {args} = this.parse(SnippetCommand)

    if (!this.wordupProject.isExecWordupProject('snippet')) {
      this.exit(5)
    }

    if(!this.wordupProject.isWordupProjectRunning()){
      this.log('No local WordPress server found, please use '+chalk.bgBlue('wordup local:install') +' or '+chalk.bgBlue('wordup local:start') )
      this.exit(4)
    }

    this.wordupProject.prepareDockerComposeUp()

    let addArgs = ''
    if(this.wordupProject.wPkg('type') === 'themes'){
        addArgs += '--theme='+this.wordupProject.wPkg('slugName')
    }else{
        addArgs += '--plugin='+this.wordupProject.wPkg('slugName')
    }

    shell.exec('docker-compose --project-directory ' + this.wordupProject.getProjectPath() + ' exec -u www-data -T wordpress wp scaffold '+args.type+' '+slugify(args.name)+' '+addArgs)

  }
}

SnippetCommand.description = `Add code snippets like Gutenberg blocks, custom post types or taxonomies to your code
...
This code snippets will be added to your current project source code. You can add as many as you want.
Just include the generated php file in your main project file.

As an example: wordup snippet block MyGutenbergBlock
`

SnippetCommand.args = [
    {
      name: 'type',
      required: true,
      description: 'What type do you want to add to your project',
      options: ['block', 'post-type','taxonomy'],
    },
    {
        name: 'name',
        required: true,
        description: 'Name of the element you want to add'
    }
  ]
  


module.exports = SnippetCommand