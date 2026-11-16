import { Injectable, OnModuleInit } from "@nestjs/common";
import { readFile } from "fs/promises";
import { join } from "path";

@Injectable()
export class PromptService implements OnModuleInit {
    private prompts = { ragSystem: '', chatTitle: '', queryRewrite: '' };

    async onModuleInit() {
        const dir = join(process.cwd(), 'prompts');
        const [ragSystem, chatTitle, queryRewrite] = await Promise.all([
            readFile(join(dir, 'rag-system.md'), 'utf-8'),
            readFile(join(dir, 'chat-title.md'), 'utf-8'),
            readFile(join(dir, 'query-rewrite.md'), 'utf-8'),
        ]);
        this.prompts = { ragSystem: ragSystem.trim(), chatTitle: chatTitle.trim(), queryRewrite: queryRewrite };
    }

    get ragSystem() {
        return this.prompts.ragSystem;
    }

    get chatTitle() {
        return this.prompts.chatTitle;
    }

    get queryRewrite(){
        return this.prompts.queryRewrite;
    }
}