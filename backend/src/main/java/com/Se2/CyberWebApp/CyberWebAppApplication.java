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
			// Seed Categories if empty (from main)
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

			// Seed Projects if empty (my logic with status and pending project)
			if (projectRepository.count() == 0) {

				List<Category> allCats = categoryRepository.findAll();
				User admin = userRepository.findAll().stream().findFirst().orElse(null);

				// Helper lambda to find category by slug
				Category webCat     = findCat(allCats, "web-development");
				Category aiCat      = findCat(allCats, "ai");
				Category mobileCat  = findCat(allCats, "mobile-app");
				Category gameCat    = findCat(allCats, "game-development");

				// Fallback: use first available category
				Category fallback = allCats.isEmpty() ? null : allCats.get(0);

				// -- Project 1: Visual Studio Code --
				Project p1 = new Project();
				p1.setName("Visual Studio Code");
				p1.setSlug("visual-studio-code");
				p1.setDescription("Visual Studio Code is a lightweight but powerful source code editor which runs on your desktop. It comes with built-in support for JavaScript, TypeScript and Node.js and has a rich ecosystem of extensions for other languages and runtimes.");
				p1.setImage("https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/visual-studio-code-icon.png");
				p1.setTechnologies("TypeScript, Electron, Node.js");
				p1.setGithubUrl("https://github.com/microsoft/vscode");
				p1.setViews(172000);
				p1.setRatingAvg(4.9);
				p1.setRatingCount(18000);
				p1.setTeamId("microsoft");
				p1.setPublishedAt("11/2015");
				p1.setCategory(webCat != null ? webCat : fallback);
				p1.setUser(admin);
				p1.setStatus((short) 1);
				projectRepository.save(p1);

				// -- Project 2: TensorFlow --
				Project p2 = new Project();
				p2.setName("TensorFlow");
				p2.setSlug("tensorflow");
				p2.setDescription("An end-to-end open source platform for machine learning. TensorFlow makes it easy for beginners and experts to create machine learning models for desktop, mobile, web, and cloud.");
				p2.setImage("https://images.viblo.asia/b143e7ef-0445-4f08-9a51-8a0a3d507792.jpg");
				p2.setTechnologies("Python, C++, CUDA");
				p2.setGithubUrl("https://github.com/tensorflow/tensorflow");
				p2.setViews(185000);
				p2.setRatingAvg(4.8);
				p2.setRatingCount(22000);
				p2.setTeamId("tensorflow");
				p2.setPublishedAt("11/2015");
				p2.setCategory(aiCat != null ? aiCat : fallback);
				p2.setUser(admin);
				p2.setStatus((short) 1);
				projectRepository.save(p2);

				// -- Project 3: React Native --
				Project p3 = new Project();
				p3.setName("React Native");
				p3.setSlug("react-native");
				p3.setDescription("React Native brings React's declarative UI framework to iOS and Android. With React Native, you use native UI controls and have full access to the native platform. Developed and maintained by Meta.");
				p3.setImage("https://reactnative.dev/img/pwa/manifest-icon-512.png");
				p3.setTechnologies("JavaScript, Java, Objective-C, Kotlin");
				p3.setGithubUrl("https://github.com/facebook/react-native");
				p3.setViews(120000);
				p3.setRatingAvg(4.7);
				p3.setRatingCount(15000);
				p3.setTeamId("facebook");
				p3.setPublishedAt("03/2015");
				p3.setCategory(mobileCat != null ? mobileCat : fallback);
				p3.setUser(admin);
				p3.setStatus((short) 1);
				projectRepository.save(p3);

				// -- Project 4: Godot Engine --
				Project p4 = new Project();
				p4.setName("Godot Engine");
				p4.setSlug("godot-engine");
				p4.setDescription("Godot Engine is a feature-packed, cross-platform game engine to create 2D and 3D games from a unified interface. It provides a comprehensive set of common tools, so you can focus on making games.");
				p4.setImage("https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/godot-game-engine-icon.png");
				p4.setTechnologies("C++, GDScript, C#");
				p4.setGithubUrl("https://github.com/godotengine/godot");
				p4.setViews(92000);
				p4.setRatingAvg(4.85);
				p4.setRatingCount(12000);
				p4.setTeamId("godotengine");
				p4.setPublishedAt("01/2014");
				p4.setCategory(gameCat != null ? gameCat : fallback);
				p4.setUser(admin);
				p4.setStatus((short) 1);
				projectRepository.save(p4);

				// -- Project 5: Pending Project (For Admin Approval Testing) --
				Project p5 = new Project();
				p5.setName("Cyber Scanner Pro");
				p5.setSlug("cyber-scanner-pro");
				p5.setDescription("A pending project waiting for admin approval. This project should not appear on the project grid until approved.");
				p5.setImage("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=300");
				p5.setTechnologies("Python, Scapy, Security");
				p5.setGithubUrl("https://github.com/example/cyber-scanner");
				p5.setViews(0);
				p5.setRatingAvg(0.0);
				p5.setRatingCount(0);
				p5.setTeamId("ghost-ops");
				p5.setPublishedAt("04/2026");
				p5.setCategory(aiCat != null ? aiCat : fallback);
				p5.setUser(admin);
				p5.setStatus((short) 2); // PENDING
				projectRepository.save(p5);
			}
		};
	}

	/** Find a category by its slug, returns null if not found. */
	private Category findCat(List<Category> cats, String slug) {
		return cats.stream().filter(c -> slug.equals(c.getSlug())).findFirst().orElse(null);
	}
}
