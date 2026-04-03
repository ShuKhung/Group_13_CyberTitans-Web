package com.Se2.CyberWebApp;

import com.Se2.CyberWebApp.entity.Category;
import com.Se2.CyberWebApp.entity.Project;
import com.Se2.CyberWebApp.entity.User;
import com.Se2.CyberWebApp.repository.CategoryRepository;
import com.Se2.CyberWebApp.repository.ProjectRepository;
import com.Se2.CyberWebApp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class CyberWebAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(CyberWebAppApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedData(CategoryRepository categoryRepository, 
									 ProjectRepository projectRepository,
									 UserRepository userRepository) {
		return args -> {
			if (categoryRepository.count() == 0) {
				Category cat1 = new Category();
				cat1.setName("Web Development");
				cat1.setSlug("web-development");
				cat1.setDescription("Project about website, web app, SaaS");
				categoryRepository.save(cat1);

				Category cat2 = new Category();
				cat2.setName("Mobile App");
				cat2.setSlug("mobile-app");
				cat2.setDescription("Applications for iOS, Android, or cross-platform");
				categoryRepository.save(cat2);

				Category cat9 = new Category();
				cat9.setName("AR VR Mixed Reality");
				cat9.setSlug("ar-vr-mixed-reality");
				cat9.setDescription("Augmented reality, virtual reality, and mixed reality projects");
				categoryRepository.save(cat9);
			}

			if (projectRepository.count() == 0) {
				Category webCat = categoryRepository.findAll().stream()
						.filter(c -> c.getSlug().equals("web-development")).findFirst().orElse(null);
				Category mobileCat = categoryRepository.findAll().stream()
						.filter(c -> c.getSlug().equals("mobile-app")).findFirst().orElse(null);
				User admin = userRepository.findById(1).orElse(userRepository.findAll().stream().findFirst().orElse(null));

				Project p1 = new Project();
				p1.setName("I am a Developer");
				p1.setSlug("i-am-a-developer");
				p1.setDescription("An application built by React Native that simulates the life of a developer from his/her born to his/her death");
				p1.setImage("media/images/projects/mobile-application.png");
				p1.setTechnologies("React Native, Firebase");
				p1.setPrice(800.00);
				p1.setCoinPrice(5000);
				p1.setViews(9527);
				p1.setRatingAvg(4.50);
				p1.setRatingCount(86);
				p1.setCategory(webCat);
				p1.setUser(admin);
				projectRepository.save(p1);

				Project p2 = new Project();
				p2.setName("I am a Developer 2");
				p2.setSlug("i-am-a-developer-2");
				p2.setDescription("An application built by React Native that simulates the life of a developer from his/her born to his/her death");
				p2.setImage("media/images/projects/mobile-application.png");
				p2.setTechnologies("Android, iOS");
				p2.setPrice(700.00);
				p2.setCoinPrice(4500);
				p2.setViews(9528);
				p2.setRatingAvg(4.90);
				p2.setRatingCount(86);
				p2.setCategory(mobileCat);
				p2.setUser(admin);
				projectRepository.save(p2);

				Project p4 = new Project();
				p4.setName("I am a Developer 4");
				p4.setSlug("i-am-a-developer-4");
				p4.setDescription("An application built by React Native that simulates the life of a developer");
				p4.setImage("media/images/projects/mobile-application.png");
				p4.setTechnologies("Spring Boot, Hibernate, NoSQL");
				p4.setPrice(900.00);
				p4.setCoinPrice(5000);
				p4.setViews(9530);
				p4.setRatingAvg(3.20);
				p4.setRatingCount(86);
				p4.setCategory(webCat);
				p4.setUser(admin);
				projectRepository.save(p4);
			}
		};
	}

}
