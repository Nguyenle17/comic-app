package com.ncomics.backend.modules.story;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ncomics.backend.modules.story.dto.CreateStoryRequest;
import com.ncomics.backend.modules.story.dto.StoryResponse;
import com.ncomics.backend.modules.story.dto.UpdateStoryRequest;
import com.ncomics.backend.modules.story.enums.Status;
import com.ncomics.backend.modules.user.UserRepository;
import com.ncomics.backend.modules.user.enums.Role;

import lombok.RequiredArgsConstructor;

@Service
public class StoryService {
}
