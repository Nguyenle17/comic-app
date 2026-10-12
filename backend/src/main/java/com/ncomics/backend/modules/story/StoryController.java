package com.ncomics.backend.modules.story;

import org.springframework.stereotype.Controller;

@Controller 
public class StoryController {
    
    private final StoryService storyService;

    public StoryController(StoryService storyService) {
        this.storyService = storyService;
    }
    
    
}
