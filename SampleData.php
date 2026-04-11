<?php

namespace common\components\importSample;

use common\components\helpers\StringHelper;
use common\components\helpers\TimeHelper;
use common\components\SystemConstant;
use common\models\Category;
use common\models\Education;
use common\models\OrderStatus;
use common\models\Policy;
use common\models\Project;
use common\models\Publication;
use common\models\PublicationType;
use common\models\Role;
use common\models\Team;
use common\models\User;
use common\models\UserExperience;
use DateTime;
use yii\base\Exception;

class SampleData
{
	private static $roleInfor = [
		[
			'name' => "Super Admin",
			'level' => 1,
			'full_access' => null,
			'editable' => null,
		],
		[
			'name' => "Admin",
			'level' => 2,
			'full_access' => null,
			'editable' => null,
		],
		[
			'name' => "Sale Manager",
			'level' => 3,
			'full_access' => '6',
			'editable' => null,
		],
		[
			'name' => "Editor Manager",
			'level' => 4,
			'full_access' => '7',
			'editable' => null,
		],
		[
			'name' => "Mentor Manager",
			'level' => 5,
			'full_access' => '8',
			'editable' => null,
		],
		[
			'name' => "Sale",
			'level' => 6,
			'full_access' => null,
			'editable' => '21,22',
		],
		[
			'name' => "Editor",
			'level' => 7,
			'full_access' => null,
			'editable' => '21,22',
		],
		[
			'name' => "Mentor",
			'level' => 8,
			'full_access' => null,
			'editable' => null,
		],
		[
			'name' => "Developer",
			'level' => 14,
			'full_access' => null,
			'editable' => null,
		],
		[
			'name' => "Researcher",
			'level' => 15,
			'full_access' => null,
			'editable' => null,
		],
		[
			'name' => "Club Member",
			'level' => 21,
			'full_access' => null,
			'editable' => null,
		],
		[
			'name' => "Student",
			'level' => 22,
			'full_access' => null,
			'editable' => null,
		],
	];

	/**
	 * @throws \yii\db\Exception
	 */
	private static function insertSampleRole()
	{
		$countRole = 0;
		foreach (self::$roleInfor as $values) {
			$role = new Role();
			$role->name = $values['name'];
			$role->slug = StringHelper::toSlug($values['name']);
//			$role->full_access = $values['full_access'];
			$role->level = $values['level'];
			$role->created_at = date('Y-m-d H:m:s');
			$role->updated_at = date('Y-m-d H:m:s');
			if ($role->save()) {
				$countRole++;
			} else {
				echo "Can not insert role: " . $role->name . PHP_EOL;
			}
		}
		echo "Inserted " . $countRole . '/' . count(self::$roleInfor) . ' roles.' . PHP_EOL;
	}

	/**
	 * user data
	 * @var array[]
	 */
	private static $userInfoArr = [
		[
			'name' => "Ngô Văn Quyền",
			'avatar' => "media/images/avatar/08062022.png",
			'birthday' => "24/04/1996",
			'gender' => 1,
			'tel' => "0987654321",
			'address' => "Thuy Son 2, Nguyen Uy ward, Ninh Binh province, Vietnam",
			'password_hash' => "SuperAdmin1@1234",
			'email' => "nvquyen2404@gmail.com",
			'role' => 1,
		],
		[
			'name' => "Lê Mạnh Toản",
			'avatar' => "media/images/avatar/toan.png",
			'birthday' => "01/01/2003",
			'gender' => 1,
			'tel' => "0987654123",
			'address' => "Truong Vien, Hoa Lu, Ninh Binh",
			'password_hash' => "Admin2@1234",
			'email' => "lemanhtoan2003@gmail.com",
			'role' => 2,
		],
		[
			'name' => "Vũ Thị Xuân",
			'birthday' => "10/11/2005",
			'email' => "xuantae1030@gmail.com",
			'avatar' => "media/images/avatar/xuantae-nobg.png",
			'gender' => 0,
			'tel' => "0987654123",
			'address' => "Truong Vien, Hoa Lu, Ninh Binh",
			'password_hash' => "Xuan@1011",
			'role' => 15,
		],
		[
			'name' => "Sale Manager",
			'avatar' => "media/images/female-avatar.png",
			'birthday' => "01/04/2003",
			'gender' => 0,
			'tel' => "0987456321",
			'address' => "Phat Diem, Kim Son, Ninh Binh",
			'password_hash' => "SaleManager@1234",
			'email' => "sale.manager@gmail.com",
			'role' => 3,
		],
		[
			'name' => "Editor Manager",
			'avatar' => "media/images/female-avatar.png",
			'birthday' => "16/05/2002",
			'gender' => 0,
			'tel' => "0987456123",
			'address' => "Ninh Xuan, Hoa Lu, Ninh Binh",
			'password_hash' => "EditorManager@1234",
			'email' => "sale3@gmail.com",
			'role' => 4,
		],
		[
			'name' => "Mentor Manager",
			'avatar' => "media/images/male-avatar.png",
			'birthday' => "19/05/2005",
			'gender' => 1,
			'tel' => "0987456246",
			'address' => "Ninh Ha, Hoa Lu, Ninh Binh",
			'password_hash' => "MentorManager@1234",
			'email' => "mentor.manager@gmail.com",
			'role' => 5,
		],
		[
			'name' => "Sale",
			'avatar' => "media/images/male-avatar.png",
			'birthday' => "21/09/2004",
			'gender' => 1,
			'tel' => "0987456357",
			'address' => "Nam Tu Liem, Ha Noi",
			'password_hash' => "Sale1@1234",
			'email' => "sale1@gmail.com",
			'role' => 6,
		],
		[
			'name' => "Editor",
			'avatar' => "media/images/female-avatar.png",
			'birthday' => "24/05/2001",
			'gender' => 0,
			'tel' => "0987235246",
			'address' => "Kim Giang, Thanh Xuan, Ha Noi",
			'password_hash' => "editor1@1234",
			'email' => "editor1@gmail.com",
			'role' => 7,
		],
		[
			'name' => "Mentor",
			'avatar' => "media/images/female-avatar.png",
			'birthday' => "17/12/2005",
			'gender' => 0,
			'tel' => "0987246357",
			'address' => "Hai Ba Trung, Ha Dong, Ha Noi",
			'password_hash' => "Mentor1@1234",
			'email' => "mentor1@gmail.com",
			'role' => 8,
		],
		[
			'name' => "Student 1",
			'avatar' => "media/images/male-avatar.png",
			'birthday' => "11/03/2008",
			'gender' => 1,
			'tel' => "0987123357",
			'address' => "Do Ngoc Du, Thanh Binh, Hai Phong",
			'password_hash' => "Student1@1234",
			'email' => "student1@gmail.com",
			'role' => 22,
		],
	];

	/**
	 *
	 * @throws Exception
	 */
	private static function insertSampleUser()
	{
		$countUsers = 0;
		foreach (self::$userInfoArr as $values) {
			$user = new User();
			$user->email = $values['email'];
			$user->avatar = $values['avatar'];
			$user->birthday = $values['birthday'];
			$user->gender = $values['gender'];
			$user->address = $values['address'];
			$user->setPassword($values['password_hash']);
			$user->name = $values['name'];
			$user->tel = $values['tel'];
			$user->generateAuthKey();
			$user->generatePasswordResetToken();
			$user->username = strstr($values['email'], '@', true);
			$user->referral_code = strstr($values['email'], '@', true);
			$user->role = $values['role'];
			$user->verified_at = date('Y-m-d H:m:s');
			$user->created_at = date('Y-m-d H:m:s');
			$user->updated_at = date('Y-m-d H:m:s');
			if ($user->save()) {
				$countUsers++;
			} else {
				echo "Can not insert user: " . $user->name . PHP_EOL;
			}
		}
		echo "Inserted " . $countUsers . '/' . count(self::$userInfoArr) . ' users.' . PHP_EOL;
	}

	/**
	 * @var array[]
	 */
	private static array $publicationType = [
		[
			"name" => "Journal Articles",
			"slug" => "article",
			"icon" => "fas fa-file-alt",
			"note" => "Peer-reviewed papers published in academic journals. Typically include author(s), title, journal name, volume, number, pages, and year."
		],
		[
			"name" => "Books & Monographs",
			"slug" => "book",
			"icon" => "fas fa-book",
			"note" => "Complete, published books authored by one or more individuals. Include publisher, year, and optionally ISBN."
		],
		[
			"name" => "Book Chapters",
			"slug" => "incollection",
			"icon" => "fas fa-book-open",
			"note" => "Chapters within an edited book. Usually include author(s), chapter title, book title, editors, publisher, and page range."
		],
		[
			"name" => "Conference Papers",
			"slug" => "inproceedings",
			"icon" => "fas fa-chalkboard-teacher",
			"note" => "Individual papers presented at conferences and published in proceedings. Common in computer science and engineering."
		],
		[
			"name" => "Proceedings",
			"slug" => "proceedings",
			"icon" => "fas fa-handshake",
			"note" => "Full conference proceedings as a publication, often edited volumes compiling all accepted papers."
		],
		[
			"name" => "Master’s Theses",
			"slug" => "mastersthesis",
			"icon" => "fas fa-user-graduate",
			"note" => "Graduate-level research works submitted to earn a Master’s degree. Include author, title, institution, and year."
		],
		[
			"name" => "PhD Theses",
			"slug" => "phdthesis",
			"icon" => "fas fa-user-ninja",
			"note" => "Doctoral dissertations submitted for a PhD degree. Typically longer and more in-depth than Master’s theses."
		],
		[
			"name" => "Technical Reports",
			"slug" => "techreport",
			"icon" => "fas fa-tools",
			"note" => "Research or project reports issued by institutions, labs, or companies. May be published internally or publicly."
		],
		[
			"name" => "Unpublished Works",
			"slug" => "unpublished",
			"icon" => "fas fa-question-circle",
			"note" => "Works not formally published but possibly circulated informally, such as drafts, preprints, or working papers."
		],
		[
			"name" => "Online Resources",
			"slug" => "online",
			"icon" => "fas fa-globe",
			"note" => "Web-based materials such as websites, online articles, datasets, blog posts, or videos. Typically include author, title, URL, and access date."
		],
		[
			"name" => "Miscellanea",
			"slug" => "misc",
			"icon" => "fas fa-ellipsis-h",
			"note" => "A catch-all category for items that don’t fit standard types—includes websites, presentations, datasets, blog posts, online documents, etc."
		]
	];

	/**
	 * @throws \yii\db\Exception
	 */
	private static function insertPublicationType()
	{
		$count = 0;
		foreach (self::$publicationType as $values) {
			$pubType = new PublicationType();
			$pubType->name = $values['name'];
			$pubType->slug = $values['slug'];
			$pubType->note = $values['note'];
			$pubType->icon = $values['icon'];
			$pubType->created_at = date('Y-m-d H:m:s');
			$pubType->updated_at = date('Y-m-d H:m:s');
			if ($pubType->save()) {
				$count++;
			} else {
				echo "Can not insert pub type: " . $pubType->name . PHP_EOL;
			}
		}
		echo "Inserted " . $count . '/' . count(self::$publicationType) . ' publication types.' . PHP_EOL;
	}

	private static array $publicationsArr = [
		[
			'title' => "Hands-on Training for Mitigating Web Application Vulnerabilities.",
			'authors' => "Ngo Van Quyen, Razvan Beuran",
			'feature_image' => 'media/images/publications/cyber-theses-jaist.png',
			'abstract' => "Web applications are becoming increasingly complex and interconnected, making them more vulnerable to attack. In 2022, web application attacks accounted for about 56% of all data breaches. This is due to the fact that web applications are often developed using frameworks that contain security vulnerabilities that are known to hackers. One of the most popular frameworks to build web applications is the Yii2 PHP Framework. Yii2 is a free and open-source framework that is used by millions of developers worldwide. It is also a very secure framework, and it has been penetration tested by a number of security experts. However, there are still some vulnerabilities, such as those caused accidentally or unknowingly by developers, that need to be mitigated. Mitigating web application vulnerabilities can be approached in several ways. One approach is to use automated tools to scan for vulnerabilities. However, these tools can only find known vulnerabilities, and they often miss new or zero-day vulnerabilities. Another approach is to use manual security testing. This involves having a security expert manually test the application for vulnerabilities. However, manual security testing is a time-consuming and expensive process. A third approach is to use hands-on training. This involves training developers on how to identify and fix vulnerabilities in web applications. Hands-on training should be used as a complement to automated tools or manual security testing, as it teaches developers secure development practices with an attacker perspective. CyPROM is a scenario progression management system for cybersecurity training that allows instructors to define training scenarios and provide target information. The management module of CyPROM uses a set of processes to drive the execution of those scenarios in the training environment. This enables conducting hands-on training in which trainees can actively engage in simulated cyberattacks, forensic investigations, and defensive measures. Thus, they can actively participate in realistic cyber exercises, gaining practical experience in dealing with cybersecurity challenges. By simulating attack scenarios, trainees can develop skills in identifying vulnerabilities, detecting and responding to threats, and implementing defensive measures. The research presented in this thesis is an endeavor focused on bolstering the security characteristics of web applications by conducting a meticulous analysis of the Yii2 framework while drawing upon the reputable OWASP Top Ten as a fundamental reference. The OWASP Top Ten, developed and maintained by the Open Web Application Security Project (OWASP) Foundation, plays a crucial role in promoting awareness about the most critical security risks faced by web applications. By attentively examining the 2021 updates and trends outlined in the OWASP Top Ten, our research ensured a comprehensive approach to addressing the most pressing threats to web application security. In particular, vulnerabilities within the Yii2 framework were identified and carefully evaluated for their potential impact on web applications, leveraging insights from the OWASP Top Ten. A significant contribution of our research lies in providing a thorough assessment of web applications built on Yii2, aligning the results with industry-accepted security standards, and offering effective strategies to enhance web application security. This was achieved by extending the functionality of CyPROM via a custom module specifically designed for analyzing web applications. Extending CyPROM required a careful understanding of the intricacies of the Yii2 framework and its underlying architecture. We conducted a thorough analysis of the framework’s source code, libraries, and dependencies to identify potential areas vulnerable to security threats. The process required reverse engineering and static code analysis to gain comprehensive insights into the framework’s security posture. After gaining a comprehensive understanding of the Yii2 framework, the CyPROM extension development commenced, entailing an in-depth investigation that surpassed mere vulnerability identification. The focus extended to crafting a specialized hands-on training program using CyPROM, tailored explicitly to address the identified vulnerabilities, accompanied by a strategic approach to tackling each security concern. The training program provided a set of systematically implemented actions and scenarios, empowering web developers with practical knowledge to proficiently secure their web applications. This included rules and heuristics inspired by the OWASP Top Ten, targeting prevalent security issues commonly encountered in web applications. Through the incorporation of this extension, CyPROM facilitated automated security assessments, bolstering the security not only of Yii2-based web applications but also laying the groundwork for enhancing the security posture of other frameworks. The extension of CyPROM was assessed comprehensively via functionality evaluation, comparative analysis of implemented actions and scenarios, and user evaluation. Overall the enhanced CyPROM demonstrated significant coverage in addressing specific vulnerabilities in web applications, with notable strengths in dealing with Broken Access Control (3.36 out of 5), Identification and Authentication Failures (3.27 out of 5), and Cryptographic Failures (3.18 out of 5). The evaluation result, determined based on 2 trainees’ feedback obtained during training sessions, estimates the capability of the enhanced CyPROM to handle these critical categories. In addition, the assessment also revealed areas that need further improvement to increase overall effectiveness in addressing other vulnerabilities. Even so, participants appreciated the clarity and conciseness of the training, which enabled them to apply their newly acquired knowledge in a real-life environment. The positive feedback from users underscored the practical value and real-world relevance of our research findings. Efforts to increase coverage in areas where CyPROM is currently less effective will help improve its capabilities. This research serves as a valuable resource for developers and security professionals, aiding them in fortifying the integrity of web applications by highlighting vulnerabilities, benchmarking against the OWASP Top Ten, and conducting a comprehensive evaluation of Yii2-based projects.",
			'keyword' => "web application vulnerabilities, hands-on training, vulnerability mitigation, CyPROM, Yii2 PHP Framework, OWASP Top Ten",
			'type' => 6,
			'year' => 2023,
			'url' => "https://dspace02.jaist.ac.jp/dspace/bitstream/10119/18734/5/paper.pdf",
			'team_abbr' => "Ngo Van Quyen",
			'school' => "Japan Advanced Institute of Science and Technology (JAIST)",
			'team_id' => "1"
		],
		[
			'title' => "Application of NASH equilibrium-based approach in solving the risk responses conflicts",
			'authors' => "Bao-Ngoc Trinh, Quyet-Thang Huynh, Xuan-Thang Nguyen, Van-Quyen Ngo, Thanh-Trung Vu",
			'feature_image' => 'media/images/publications/largepreview.png',
			'abstract' => "The responses to a given risk reflect the risk assessment and the organization's attitude to risk, response method to risk can cause a problem to the response method of another risk. Therefore, the project manager cannot decide which risk response will be used in case of conflicts happen. Until now, the amount of research which deals with risk responses is count-on-finger. This paper proposes a model and the algorithm to resolve this conflict. The problem-solving model introduced below will base on Project Network and Game Theory, in which players of the game are risks, and the solution of this game is a Nash Equilibrium. The input information of the game will be described in the Project Network model, which can be used later in a Genetic Algorithm. The chromosome model of Genetic Algorithm is a Nash Equilibrium of the game whereas providing the balance in selecting a response method to each risk.",
			'keyword' => "Game theory, Project network, Risk response, Nash equilibrium, Genetic algorithm",
			'type' => 1,
			'year' => 2018,
			'url' => "https://www.researchgate.net/publication/329962461_APPLICATION_OF_NASH_EQUILIBRIUM_BASED_APPROACH_IN_SOLVING_THE_RISK_RESPONSES_CONFLICTS",
			'team_abbr' => "Van-Quyen Ngo",
			'publisher' => "Le Quy Don Technical University - Section on Information and Communication Technology (LQDTU-JICT)",
			'team_id' => "1",
			'volume' => "193",
			'journal' => 'Journal of Science and Technology (JST)',
			'number' => "12",
			'pages' => "17-31",
			'issn' => "859-0209"
		],
		[
			'title' => "My Journey to Japan",
			'authors' => "Ngo Van Quyen",
			'feature_image' => 'media/images/publications/20220222-1.jpg',
			'abstract' => "None",
			'keyword' => "None",
			'type' => 10,
			'year' => 2023,
			'url' => "https://ssp.jst.go.jp/sns/abroad/mayway/20230222_1.html",
			'url_date' => "2025-08-08 04:24:09",
			'team_abbr' => "Ngo Van Quyen",
			'publisher' => "Japan Science and Technology Agency (JST)",
			'team_id' => "1",
		],
		[
			'title' => "Transforming machine translation for isolating languages with multi-source neural model",
			'authors' => "Nguyen Ngoc Lan, Trinh Bao Ngoc, Le Phuong Thao, Nguyen Thanh Cong, Le Manh Toan, Tran Dinh Dien, Bui Phan Tue Anh, Vuong Thi Van, Nguyen Nhat Trang, Nguyen Tien Thanh",
			'feature_image' => 'media/images/publications/54920e.jpg',
			'abstract' => "Recent advancements in Artificial intelligence (AI) and Deep learning have facilitated the rapid development of machine translation technologies, among them, Neural machine translation (NMT) models have demonstrated impressive performance, especially in handling multiple language pairs. However, due to their complexity and lack of appropriate data, contemporary NMT models still have a lot of challenges when applied to isolated languages, despite their great accomplishments. This paper proposes a multi-source neural model that employs two different encoders to process both the source word sequence and the linguistic feature sequences of isolating languages. Unlike traditional NMT models, this approach improves the encoders’ input embeddings by incorporating a second encoder that integrates the linguistic elements, including part-of-speech (POS) tags and lemma. To enhance the source sentence's context representation, this article combines the encoders' conditional data with the outputs of the decoders using a serial combination technique. In this way, different metrics such as METEOR and BLEU are examined to assess the suggested model's precision of translation. Experimental results indicate that our methodology works efficiently for isolating language translation, as evidenced by the improvement of +3.9 BLEU and +3.2 METEOR scores on translation tasks conventional NMT models perform. This highlights a significant advancement in integrating linguistic features to enhance translation accuracy for isolating languages.",
			'keyword' => "Artificial Intelligence, Neural Machine Translation, Linguistic Features, Isolated Language, BLEU, METEOR",
			'type' => 1,
			'year' => 2025,
			'url' => "https://www.jatit.org/volumes/Vol103No3/5Vol103No3.pdf",
			'url_date' => "2025-08-08 04:24:09",
			'team_abbr' => "Le Manh Toan",
			'publisher' => "Little Lion Scientific",
			'team_id' => "2",
			'volume' => "103",
			'journal' => "Journal of Theoretical and Applied Information Technology (JATIT)",
			'number' => "3",
			'pages' => "835-847",
			'issn' => "1992-8645"
		],
	];

	/**
	 * @throws \yii\db\Exception
	 */
	private static function insertPublication()
	{
		$count = 0;
		foreach (self::$publicationsArr as $values) {
			$pub = new Publication();
			$pub->title = $values['title'];
			$pub->slug = StringHelper::toSlug($values['title']);
			$pub->authors = $values['authors'];
			$pub->feature_image = $values['feature_image'];
			$pub->abstract = $values['abstract'];
			$pub->keyword = $values['keyword'];
			$pub->type = $values['type'];
			$pub->year = $values['year'];
			$pub->team_abbr = $values['team_abbr'];
			$pub->school = empty($values['school']) ? null : $values['school'];
			$pub->url = $values['url'];
			$pub->url_date = empty($values['url_date']) ? null : $values['url_date'];
			$pub->publisher = empty($values['publisher']) ? null : $values['publisher'];
			$pub->volume = empty($values['volume']) ? null : $values['volume'];
			$pub->journal = empty($values['journal']) ? null : $values['journal'];
			$pub->number = empty($values['numbers']) ? null : $values['numbers'];
			$pub->pages = empty($values['pages']) ? null : $values['pages'];
			$pub->issn = empty($values['issn']) ? null : $values['issn'];
			$pub->team_id = $values['team_id'];
			$pub->created_at = date('Y-m-d H:m:s');
			$pub->updated_at = date('Y-m-d H:m:s');
			if ($pub->save()) {
				$count++;
			} else {
				echo "Can not insert publication: " . $pub->title . PHP_EOL;
			}
		}
		echo "Inserted " . $count . '/' . count(self::$publicationsArr) . ' publications.' . PHP_EOL;
	}

	private static $orderStatusInfor = [
		[
			'label' => "pending",
			'group' => SystemConstant::ORDER_STATUS_GROUP[0],
			'description' => "Waiting for approval or payment",
		],
		[
			'label' => "accepted",
			'group' => SystemConstant::ORDER_STATUS_GROUP[0],
			'description' => "Request is accepted",
		],
		[
			'label' => "rejected",
			'group' => SystemConstant::ORDER_STATUS_GROUP[0],
			'description' => "Request is declined",
		],
		[
			'label' => "cancelled",
			'group' => SystemConstant::ORDER_STATUS_GROUP[0],
			'description' => "Request was cancelled by user",
		],
		[
			'label' => "in_progress",
			'group' => SystemConstant::ORDER_STATUS_GROUP[0],
			'description' => "Mentoring session is currently happening",
		],
		[
			'label' => "completed",
			'group' => SystemConstant::ORDER_STATUS_GROUP[0],
			'description' => "Session completed successfully",
		],
		[
			'label' => "no_show",
			'group' => SystemConstant::ORDER_STATUS_GROUP[0],
			'description' => "Mentee did not show up",
		],
		[
			'label' => "expired",
			'group' => SystemConstant::ORDER_STATUS_GROUP[0],
			'description' => "Request expired before confirmation",
		],
		[
			'label' => "unpaid",
			'group' => SystemConstant::ORDER_STATUS_GROUP[1],
			'description' => "No payment has been made",
		],
		[
			'label' => "paid",
			'group' => SystemConstant::ORDER_STATUS_GROUP[1],
			'description' => "Full payment received",
		],
		[
			'label' => "partial",
			'group' => SystemConstant::ORDER_STATUS_GROUP[1],
			'description' => "Partial payment received",
		],
		[
			'label' => "refunded",
			'group' => SystemConstant::ORDER_STATUS_GROUP[1],
			'description' => "Payment has been refunded",
		],
		[
			'label' => "failed",
			'group' => SystemConstant::ORDER_STATUS_GROUP[1],
			'description' => "Payment could not be processed",
		],
		[
			'label' => "pending_payment",
			'group' => SystemConstant::ORDER_STATUS_GROUP[1],
			'description' => "Awaiting payment completion",
		],
	];

	/**
	 * @throws \yii\db\Exception
	 */
	private static function insertOrderStatus()
	{
		$count = 0;
		foreach (self::$orderStatusInfor as $values) {
			$model = new OrderStatus();
			$model->label = $values['label'];
			$model->group = $values['group'];
			$model->description = $values['description'];
			$model->slug = StringHelper::stripVN($values['group'] . " " . $values['label']);
			$model->created_at = date('Y-m-d H:m:s');
			$model->updated_at = date('Y-m-d H:m:s');
			if ($model->save()) {
				$count++;
			} else {
				echo "Can not insert order status: " . $model->slug . PHP_EOL;
			}
		}
		echo "Inserted " . $count . '/' . count(self::$orderStatusInfor) . ' status.' . PHP_EOL;
	}

	private static $teamInfo = [
		[
			'name' => "Ngô Văn Quyền",
			'nickname' => "The Doctor",
			'title' => "MSc",
			'user_id' => 1,
			'position' => "Software Lecturer",
			'joined_year' => 2025,
			'left_year' => null,
			'bio' => "I want to contribute to a dynamic academic and research environment that emphasizes innovation, interdisciplinary learning, and real-world impact. With my vast experience in software engineering, machine learning, and pedagogy, I aim to guide future developers while advancing meaningful research. I am looking for opportunities that allow me to integrate teaching and technology to solve complex challenges. As Doctor Who once said, “In the end, we’re all stories. Just make it a good one.”",
			'social' => "facebook:https://www.facebook.com/thedoctor2404@#linkedin:https://www.linkedin.com/in/thedoctor2404/@#github:https://github.com/CtrlShiftN",
			'rate_per_hour' => 1000,
			'rate_per_project' => null,
			'currency_unit' => SystemConstant::CURRENCY_UNIT[0],
		],
		[
			'name' => "Lê Mạnh Toản",
			'nickname' => "Tôm",
			'title' => "Mr",
			'user_id' => 2,
			'position' => "Mentor",
			'joined_year' => 2025,
			'left_year' => null,
			'bio' => "Aspiring software developer with a strong passion for programming, eager to gain hands-on experience and deepen my understanding of real-world software development. Seeking an internship opportunity where I can learn from experienced engineers, participate in practical projects. I am dedicated to continuous learning, and contributing effectively to a dynamic team based on open mindset and communication.",
			'social' => "facebook:https://www.facebook.com/toanlemanh2003@#linkedin:https://www.linkedin.com/in/m%E1%BA%A1nh-to%E1%BA%A3n-l%C3%AA-855a23355/@#youtube:https://www.youtube.com/@toanlemanh2003fithanu@#github:https://github.com/toanlemanh",
			'rate_per_hour' => 800,
			'rate_per_project' => 2000,
			'currency_unit' => SystemConstant::CURRENCY_UNIT[0],
		],
		[
			'name' => "Xuân Vũ",
			'nickname' => "Xuan Tae",
			'title' => "Ms",
			'user_id' => 3,
			'position' => "Researcher",
			'joined_year' => 2025,
			'left_year' => null,
			'bio' => "Aspiring software developer with a strong passion for programming, eager to gain hands-on experience and deepen my understanding of real-world software development. Seeking an internship opportunity where I can learn from experienced engineers, participate in practical projects. I am dedicated to continuous learning, and contributing effectively to a dynamic team based on open mindset and communication.",
			'social' => "facebook:https://www.facebook.com/toanlemanh2003@#linkedin:https://www.linkedin.com/in/m%E1%BA%A1nh-to%E1%BA%A3n-l%C3%AA-855a23355/@#youtube:https://www.youtube.com/@toanlemanh2003fithanu@#github:https://github.com/toanlemanh",
			'rate_per_hour' => 700,
			'rate_per_project' => 1200,
			'currency_unit' => SystemConstant::CURRENCY_UNIT[0],
		],
	];

	/**
	 * @throws \yii\db\Exception
	 */
	private static function insertTeam()
	{
		$count = 0;
		foreach (self::$teamInfo as $values) {
			$model = new Team();
			$model->name = $values['name'];
			$model->nickname = $values['nickname'];
			$model->title = $values['title'];
			$model->user_id = $values['user_id'];
			$model->position = $values['position'];
			$model->joined_year = $values['joined_year'];
			$model->left_year = $values['left_year'];
			$model->bio = $values['bio'];
			$model->social = $values['social'];
			$model->rate_per_hour = $values['rate_per_hour'];
			$model->rate_per_project = $values['rate_per_project'];
			$model->currency_unit = $values['currency_unit'];
			$model->created_at = date('Y-m-d H:m:s');
			$model->updated_at = date('Y-m-d H:m:s');
			if ($model->save()) {
				$count++;
			} else {
				echo "Can not insert team: " . $model->name . PHP_EOL;
			}
		}
		echo "Inserted " . $count . '/' . count(self::$teamInfo) . ' team members.' . PHP_EOL;
	}

	private static $policyInfo = [
		[
			'title' => "Information We Collect",
			'content' => "",
			'content_html' => '<ul class="list-group list-group-flush"><li class="list-group-item"><i class="fab fa-odnoklassniki-square me-2"></i>Name, email, and contact details <small>(if you sign up or submit a form)</small>.</li><li class="list-group-item"><i class="fab fa-odnoklassniki-square me-2"></i>IP address, browser type, pages visited, and time of access <small>(via Google Analytics or similar)</small>.</li><li class="list-group-item"><i class="fab fa-odnoklassniki-square me-2"></i>OAuth login data <small>(if you use Google, GitHub, or LinkedIn to sign in)</small>.</li></ul>',
			'type' => 0,
			'version' => "v1.0",
		],
		[
			'title' => "How We Use Your Information",
			'content' => "",
			'content_html' => '<ul class="list-group list-group-flush"><li class="list-group-item"><i class="fab fa-odnoklassniki-square me-2"></i>To authenticate users and grant access.</li><li class="list-group-item"><i class="fab fa-odnoklassniki-square me-2"></i>To send notifications, technical support, and system updates.</li><li class="list-group-item"><i class="fab fa-odnoklassniki-square me-2"></i>To analyze user behavior for improving our platform and services.</li></ul>',
			'type' => 0,
			'version' => "v1.0",
		],
		[
			'title' => "Data Sharing",
			'content' => "",
			'content_html' => 'We do <b>NOT</b> sell or share your personal data with third parties unless:<ul class="list-group list-group-flush"><li class="list-group-item"><i class="fab fa-odnoklassniki-square me-2"></i>Required by law.</li><li class="list-group-item"><i class="fab fa-odnoklassniki-square me-2"></i>You have given explicit consent.</li><li class="list-group-item"><i class="fab fa-odnoklassniki-square me-2"></i>Necessary for providing essential services (e.g., OAuth login with Google/GitHub).</li></ul>',
			'type' => 0,
			'version' => "v1.0",
		],
		[
			'title' => "Data Security",
			'content' => "",
			'content_html' => '<ul class="list-group list-group-flush"><li class="list-group-item"><i class="fab fa-odnoklassniki-square me-2"></i>All data is encrypted and stored securely.</li><li class="list-group-item"><i class="fab fa-odnoklassniki-square me-2"></i>We apply modern security measures against threats such as CSRF, XSS, and SQL Injection.</li></ul>',
			'type' => 0,
			'version' => "v1.0",
		],
		[
			'title' => "Your Rights",
			'content' => "",
			'content_html' => '<ul class="list-group list-group-flush"><li class="list-group-item"><i class="fab fa-odnoklassniki-square me-2"></i>You can request to view, edit, or delete your personal data at any time.</li><li class="list-group-item"><i class="fab fa-odnoklassniki-square me-2"></i>You may refuse to provide certain data, but this might limit access to some features.</li></ul>',
			'type' => 0,
			'version' => "v1.0",
		],
		[
			'title' => "Do I need an account to use Cyb3r Web?",
			'content' => "No, but signing in with Google, GitHub, or LinkedIn gives you access to personalized features and full functionality.",
			'content_html' => '',
			'type' => 1,
			'version' => "v1.0",
		],
		[
			'title' => "Can I delete my account?",
			'content' => "Yes. You can request account deletion by contacting our admins",
			'content_html' => '',
			'type' => 1,
			'version' => "v1.0",
		],
		[
			'title' => "I’m having trouble logging in with Google/GitHub,... What should I do?",
			'content' => "Please try again after a few minutes or check your browser settings. If the problem persists, contact our technical support team.",
			'content_html' => '',
			'type' => 1,
			'version' => "v1.0",
		]
	];

	private static function insertPolicy()
	{
		$count = 0;
		foreach (self::$policyInfo as $values) {
			$model = new Policy();
			$model->title = $values['title'];
			$model->slug = StringHelper::toSlug($values['title']);
			$model->content = $values['content'];
			$model->content_html = $values['content_html'];
			$model->type = "" . $values['type'];
			$model->version = $values['version'];
			$model->category = 1;
			$model->created_at = date('Y-m-d H:m:s');
			$model->updated_at = date('Y-m-d H:m:s');
			if ($model->save()) {
				$count++;
			} else {
				echo "Can not insert policy: " . $model->title . PHP_EOL;
				print_r($model->errors);
			}
		}
		echo "Inserted " . $count . '/' . count(self::$policyInfo) . ' policy + FAQs.' . PHP_EOL;
	}

	private static $eduInfo = [
		[
			'user_id' => 1,
			'institution' => 'Hanoi University (HanU)',
			'institution_logo' => 'media/images/experience/hanulogo.png',
			'institution_address' => 'Km 9, Nguyen Trai street, Dai Mo ward, Hanoi city, Vietnam',
			'institution_website' => 'https://www.hanu.vn/',
			'specialization' => 'Information Technology',
			'title' => 'Bachelor',
			'study_mode' => 'Full-time',
			'thesis_title' => null,
			'thesis_url' => null,
			'start_year' => '09/2014',
			'end_year' => '06/2018',
			'graduation_date' => '15/06/2018',
			'description_html' => 'During my time at university, I was heavily involved in both my academic studies and my extracurricular activities. I took a wide range of courses in computer science and related fields that gave me a solid foundation of theoretical principles and practical expertise. These courses covered important areas such as Java programming, MySQL, network security, data structures and artificial intelligence and laid the foundation for my technical skills. In addition to the courses, I actively participated in numerous academic conferences and research activities. Of particular note is my participation in presenting topics such as Mobile Malware: Attacks and Defense and Game Theory: Multi-objective Optimization at the Hanu - Kosen conference. In addition, I had the privilege of participating in the Sakura Science Exchange Program, where I worked on robotic applications, gaining invaluable hands-on experience and a deeper understanding of the real-world applications of the technology. These experiences not only strengthened my technical skills, but also instilled a strong passion for research and development. They have motivated me to pursue an academic career in which I want to contribute to advances in computer science, particularly in the areas of artificial intelligence and software development.',
			'document_proof_url' => null,
			'gpa' => 6.7,
			'courses' => 'AIW425@#Advanced Internet & Web Services@#;EBZ324@#E-Business@#;ENG101@#English@#IELTS B2;FIT222@#Principles of Computing@#;FIT223@#Introduction to Programming@#Java core;FIT226@#Principles of Operating systems@#;FIT324@#Data Structure and Algorithms@#;FIT325@#Principles of Programming Languages@#Java OOP, MVC;FIT327@#Computer Network@#;FIT328@#Database Systems@#MySQL, SQL Server;FIT329@#System Analysis and Design@#;FIT330@#Software Engineering@#Java MVC, Swing;FIT332@#Information Systems@#;FIT333@#Human-Computer Interaction@#;FIT334@#Network Security@#;FIT431@#Artificial Intelligence@#Prolog, Mathlab;FIT436@#Project Management@#;FIT445@#Java Technology@#;ISD421@#Information Systems Design@#;MAT201@#Calculus@#;MAT204@#Probability and Statistics@#;MAT206@#Discrete Maths@#;MAT207@#Algebra@#',
			'activity' => '122015122016001@#Hanu - Kosen Conference@#Mobile malware: Attacks and defense; 122016122016002@#Hanu - Kosen Conference@#Game theory: Multi-objective optimization; 012017012017003@#Hanu - Kosen Conference@#Build Java application for Nash equilibrium problem; 062017062017004@#SCICT 2017@#Developing Caller Identifying Application for Android Phones; 062017062017005@#SCICT 2017@#Risk Management; 102017102017006@#Sakura Science Exchange Programme 2017@#Robot and Its Application',
			'achievement' => '',
			'reference' => 'Dr. Trinh Bao Ngoc@#0987355xxx@#Vice Dean of Faculty of Information Technology, Hanoi University',
			'alumni_network_url' => '',
		],
		[
			'user_id' => 1,
			'institution' => 'Japan Advanced Institute of Science and Technology (JAIST)',
			'institution_logo' => 'media/images/experience/jaistlogo.png',
			'institution_address' => '1 Chome-1 Asahidai, Nomi, Ishikawa 923-1211, Japan',
			'institution_website' => 'https://www.jaist.ac.jp/english/',
			'specialization' => 'Computer Science',
			'title' => 'Master',
			'study_mode' => 'Full-time',
			'thesis_title' => 'Hands-on Training for Mitigating Web Application Vulnerabilities',
			'thesis_url' => 'https://dspace.jaist.ac.jp/dspace/bitstream/10119/18734/5/paper.pdf',
			'start_year' => '09/2022',
			'end_year' => '09/2023',
			'graduation_date' => '22/09/2023',
			'description_html' => "In earning the master's degree, the focus was on developing a solid foundation in advanced computational theories, algorithms and cybersecurity principles. Key areas of expertise include optimization techniques, machine learning, game theory and coding theory, as well as a deep understanding of network security and software design methods. The practical application of these skills was demonstrated in the NEC Attack Scripting project, which involved analyzing and developing real-world security solutions. The final project focused on cybersecurity, specifically the <a href='https://dspace.jaist.ac.jp/dspace/bitstream/10119/18734/5/paper.pdf' class='text-decoration-none' target='_blank'>Hands-on Training for Mitigating Web Application Vulnerabilities</a>, which not only deepened knowledge of security protocols, but also provided hands-on experience in remediating critical vulnerabilities in web applications. This academic journey provided comprehensive skills in both theoretical foundations and practical implementation, preparing for future contributions to the field of cybersecurity and beyond.",
			'document_proof_url' => 'https://dspace.jaist.ac.jp/dspace/bitstream/10119/18734/5/paper.pdf',
			'gpa' => 0.00,
			'courses' => 'G213@#Social Problems in Modern Japan@#;I116E@#Fundamentals of Programming@#Python Programming;I214E@#System Optimization@#Linear Programming, Network Optimization, Nonlinear Programming, Combinatorial Optimization, System Optimization;I219E@#Software Design Methodology@#Java OOP Design;I226E@#Computer Network@#;I232E@#Information Theory@#Entropy, Mutual Information and Divergence, Source Coding, Channel Coding, Gaussian Channel, Rate Distortion, Optimization;I235E@#Game Informatics@#Game History, Game Theory, Chips Challenging, Consensus in Games, Game Refinement, Motion in mind, Disruptive AI, Clustering, Single-Agent Search, Machine Learning, Procedural Content Generation;I239E@#Machine Learning@#;I437E@#Coding Theory@#Error Correcting Code, Abstract Algebra, Lattice, Quantization, Nested Lattice codes, Linear Block codes, Decoding Linear Block codes, Low-density Parity Check, Polar codes;I470@#Theory of Advanced Algorithms@#;S101@# Innovation Theory and Methodology for Social Competencies@#;S102@#Innovation Theory and Methodology for Creativity@#',
			'activity' => '',
			'achievement' => '',
			'reference' => 'Assoc. Prof. Razvan Beuran@#https://www.jaist.ac.jp/~razvan/@#Japan Advanced Institute of Science and Technology (JAIST), in Ishikawa prefecture, Japan',
			'alumni_network_url' => '',
		],
		[
			'user_id' => 1,
			'institution' => 'Hanoi University (HanU)',
			'institution_logo' => 'media/images/experience/hanulogo.png',
			'institution_address' => 'Km 9, Nguyen Trai street, Dai Mo ward, Hanoi City, Vietnam',
			'institution_website' => 'https://www.hanu.vn',
			'specialization' => 'English Pedagogy',
			'title' => 'Bachelor',
			'study_mode' => 'Part-time',
			'thesis_title' => null,
			'thesis_url' => null,
			'start_year' => '12/2024',
			'end_year' => null,
			'graduation_date' => null,
			'description_html' => "",
			'document_proof_url' => 'https://www.hanu.vn/a/162739/Ket-qua-tuyen-sinh-bang-dai-hoc-thu-hai-nganh-Ngon-ngu-Anh-va-Ngon-ngu-Trung-Quoc-dot-2-nam-2024',
			'gpa' => 0.0,
			'courses' => '63ENG3GR1@#English Grammar 1;63ENG3LEX@#English Lexicology;63ENG3PHP@#English Phonetics and Phonology;63ENG3TE1@#English Language Teaching Methodology 1;63ENG4PLT@#Psychology in Language Teaching;63ENG2C1@#Language skills C1;63ENG3RES@#Research Methods;63ENG3SLT@#Language Acquisition Theories;63VIP1INL@#Introduction to Linguistics;63VIP1IVC@#Fundamentals of Vietnamese Culture;63VIP2HWC@#History of World Civilization;63VIP2IVL@#Introductory Vietnamese Linguistics;63VIP2VIU@#Vietnamese in Use;63ENG1A2@#Language skills A2;63ENG1B1@#Language skills B1;63ENG1STS@#Study skills;63ENG2B2@#Language skills B2;63FIT1CSK@#Computer Skills;63NDE1NDS@#National Defence & Security Education;63PED1MDR@#Middle-Distance Running;63PED1PP1@#Pingpong 1;63PED1PP2@#Pingpong 2;63PML1PML@#Philosophy of Marxism-Leninism;63PML1POE@#Political Economics Marxism-Leninism;63PML2GEL@#General Law;63PML2HVC@#History of Vietnam Communist Party;63PML2SCS@#Scientific Socialism;63PML3HCM@#Ho Chi Minh Ideology',
			'activity' => '',
			'achievement' => '',
			'reference' => null,
			'alumni_network_url' => '',
		],
		[
			'user_id' => 1,
			'institution' => 'Posts and Telecommunications Institute of Technology (PTIT)',
			'institution_logo' => 'media/images/experience/ptitlogo.png',
			'institution_address' => '96A, Tran Phu street, Mo Lao ward, Hanoi city, Vietnam',
			'institution_website' => 'https://www.ptit.edu.vn',
			'specialization' => 'Information System',
			'title' => 'Doctor',
			'study_mode' => 'Full-time',
			'thesis_title' => null,
			'thesis_url' => null,
			'start_year' => '09/2025',
			'end_year' => null,
			'graduation_date' => null,
			'description_html' => "",
			'document_proof_url' => null,
			'gpa' => 0.0,
			'courses' => 'None',
			'activity' => '',
			'achievement' => '',
			'reference' => null,
			'alumni_network_url' => '',
		],
		[
			'user_id' => 2,
			'institution' => 'Hanoi University (HanU)',
			'institution_logo' => 'media/images/experience/hanulogo.png',
			'institution_address' => 'Km 9, Nguyen Trai street, Dai Mo ward, Hanoi city, Vietnam',
			'institution_website' => 'https://www.hanu.vn',
			'specialization' => 'Information Technology',
			'title' => 'Bachelor',
			'study_mode' => 'Full-time',
			'thesis_title' => null,
			'thesis_url' => null,
			'start_year' => '09/2021',
			'end_year' => '06/2025',
			'graduation_date' => '05/06/2025',
			'description_html' => 'Studied core and advanced topics in Information Technology, including algorithms, data structures, software engineering, and artificial intelligence. Participated in multiple research projects and collaborative software development initiatives, gaining hands-on experience in problem-solving, coding, and technical documentation. Actively engaged in academic and extracurricular activities such as mentoring junior students in programming and algorithms, participating in the Sakura Science Club (JST), and volunteering in community events.',
			'document_proof_url' => 'https://drive.google.com/drive/folders/14euNclzvZou5fOHyxLMblNR-zAYcRgLB',
			'gpa' => 3.24,
			'courses' => '61FIT2CAL@#Calculus@#;61FIT2PR1@#Programming 1@#Java Core;61FIT2PR2@#Programming 2@#Java Advanced;61FIT2AIN@#Artificial Intelligence@#Statistics and Probability, Natural Language Processing, Python;61FIT2POP@#Principle of Operation@#Operations, Linux Ubuntu, C++;61FIT2DSA@#Data Structures and Algorithms@# Stack, Queue, Graph, Tree, Search algorithms, Sort algorithms;61FIT2SE1@#Software Engineering 1@#Java Spring MVC, XAMPP;61FIT2SE2@#Software Engineering 2@#Java Spring and Test;61FIT2SAD@#System Analysis and Design@#Agile, Waterfall, UX/UI, Figma;61FIT2WPR@#Web Programming@#HTML5, CSS3, Javascript ES6, ReactJS, NodeJS, ExpressJS;61FIT2SS1@#Special Subject 1@#Game Theory, Stable Matching, Computer Vision;61FIT2SS2@#Special Subject 2@#Game Theory, Stable Matching, Computer Vision;',
			'activity' => '082023122026001@#Cyb3r T1tans Club@#IT Mentor;052024062025002@#Mentorship Program@#Mentor for junior students in programming and algorithms;062025062025003@#Sakura Science Club (JST)@#Participant in international exchange activities;072025072025004@#Volunteer Program@#Blood Donation Campaign Volunteer',
			'achievement' => 'Second Prize at the Faculty-level Scientific Research Conference',
			'reference' => 'Dr. Trinh Bao Ngoc@#0987355xxx@#Vice Dean of Faculty of Information Technology, Hanoi University',
			'alumni_network_url' => '',
		],
	];

	private static function insertEducation()
	{
		$count = 0;
		foreach (self::$eduInfo as $values) {
			$model = new Education();
			$model->user_id = $values['user_id'];
			$model->institution = $values['institution'];
			$model->institution_logo = $values['institution_logo'];
			$model->institution_address = $values['institution_address'];
			$model->institution_website = $values['institution_website'];
			$model->specialization = $values['specialization'];
			$model->title = $values['title'];
			$model->thesis_title = $values['thesis_title'];
			$model->thesis_url = $values['thesis_url'];
			$model->study_mode = $values['study_mode'];
			$model->start_year = TimeHelper::normalizeDate($values['start_year'], 'd/m/Y');
			$model->end_year = $values['end_year'] !== null ? TimeHelper::normalizeDate($values['end_year'], 'd/m/Y', true) : null;
			$model->graduation_date = $values['graduation_date'] !== null ? TimeHelper::normalizeDate($values['graduation_date']) : null;
			$model->description_html = $values['description_html'];
			$model->document_proof_url = $values['document_proof_url'];
			$model->gpa = doubleval($values['gpa']);
			$model->courses = $values['courses'];
			$model->activity = $values['activity'];
			$model->achievement = $values['achievement'];
			$model->reference = $values['reference'];
			$model->alumni_network_url = $values['alumni_network_url'];
			$model->created_at = date('Y-m-d H:m:s');
			$model->updated_at = date('Y-m-d H:m:s');
			if ($model->save()) {
				$count++;
			} else {
				echo "Can not insert education: " . $model->institution . PHP_EOL;
				print_r($model->errors);
			}
		}
		echo "Inserted " . $count . '/' . count(self::$eduInfo) . ' education.' . PHP_EOL;
	}

	private static $expInfo = [
		[
			'user_id' => 1,
			'organization_name' => "FPT Telecom Ha Noi",
			'organization_logo' => 'media/images/experience/ftellogo.png',
			'organization_address' => '2nd floor, FPT Cau Giay building, 17 Duy Tan street, Dich Vong Hau ward, Cau Giay district, Hanoi City, Vietnam',
			'discipline' => 'Software Engineering',
			'country' => 'Vietnam',
			'position_title' => 'Intern',
			'content' => null,
			'course_info' => null,
			'teaching_format' => null,
			'teaching_level' => null,
			'annual_teaching_hours' => null,
			'start_date' => '07/2017',
			'end_date' => '09/2017',
			'description' => "Contributed to the development and maintenance of the SCC-C (Service Command Central), which supports key service management operations. Responsibilities included assisting with software development tasks, conducting code reviews, and participating in Scrum-based team activities. Applied basic knowledge of Java and PHP to implement minor functionality, troubleshoot bugs and support integration processes. I also researched the Scrum methodology and gave a presentation on its application within the SCC-C projects. This internship enhanced practical understanding of collaborative software development workflows and agile practices while contributing to incremental improvements in system functionality and performance.",
			'document_proof_url' => null,
			'activities_info' => null,
			'achievements_info' => null,
			'materials_url' => null,
			'reference_info' => null,
			'type' => 'intership',
			'tags' => 'Java, PHP, Scrum',
		],
		[
			'user_id' => 1,
			'organization_name' => "FPT Software",
			'organization_logo' => 'media/images/experience/fsoftlogo.png',
			'organization_address' => 'F-Ville Building, Technology Village No. 3 & 4, Software Area, Hoa Lac Hi-tech Park, Km29, Thanglong Freeway, Thach That District, Hanoi, Vietnam',
			'discipline' => 'Software Engineering',
			'country' => 'Vietnam',
			'position_title' => 'Intern',
			'content' => "Java Web (Spring, Hibernate)@#SQL Server",
			'course_info' => null,
			'teaching_format' => null,
			'teaching_level' => null,
			'annual_teaching_hours' => null,
			'start_date' => '02/2018',
			'end_date' => '03/2018',
			'description' => null,
			'document_proof_url' => null,
			'activities_info' => null,
			'achievements_info' => null,
			'materials_url' => null,
			'reference_info' => null,
			'type' => 'intership',
			'tags' => 'Java Web, Spring, Hibernate',
		],
		[
			'user_id' => 1,
			'organization_name' => "E-Sing Viet Nam",
			'organization_logo' => 'media/images/experience/defaultlogo.png',
			'organization_address' => 'Thanh Thuy, Phu Tho district, Vietnam',
			'discipline' => 'Software Engineering',
			'country' => 'Vietnam',
			'position_title' => 'IT Manager',
			'content' => "www.esing.vn (Wordpress)@#Compose English songs lyric@#Other technical issues",
			'course_info' => null,
			'teaching_format' => null,
			'teaching_level' => null,
			'annual_teaching_hours' => null,
			'start_date' => '04/2018',
			'end_date' => '02/2019',
			'description' => null,
			'document_proof_url' => null,
			'activities_info' => null,
			'achievements_info' => null,
			'materials_url' => null,
			'reference_info' => null,
			'type' => 'manager',
			'tags' => 'PHP, Wordpress',
		],
		[
			'user_id' => 1,
			'organization_name' => "VIET NAM MANGOTECH TECHNOLOGY JOINT STOCK COMPANY (VietMango JSC)",
			'organization_logo' => 'media/images/experience/defaultlogo.png',
			'organization_address' => '19/9, Quynh Loi street, Quynh Mai district, Hai Ba Trung ward, Ha Noi city, Vietnam',
			'discipline' => 'Software Engineering',
			'country' => 'Vietnam',
			'position_title' => 'Business Analysis',
			'content' => "Chinese Ordering Website@#POS System",
			'course_info' => null,
			'teaching_format' => null,
			'teaching_level' => null,
			'annual_teaching_hours' => null,
			'start_date' => '02/2019',
			'end_date' => '04/2019',
			'description' => null,
			'document_proof_url' => null,
			'activities_info' => null,
			'achievements_info' => null,
			'materials_url' => null,
			'reference_info' => null,
			'type' => 'manager',
			'tags' => 'Business Analysis, Mockup',
		],
		[
			'user_id' => 1,
			'organization_name' => "E-Sing Language",
			'organization_logo' => 'media/images/experience/defaultlogo.png',
			'organization_address' => '1 HUng Vuong street, Hoi Hop ward, Vinh Yen city, Vinh Phuc province, Vietnam',
			'discipline' => 'Language Education',
			'country' => 'Vietnam',
			'position_title' => 'Director',
			'content' => "Supervision and Evaluation@#Strategy and Technique@#Administering the language requirement",
			'course_info' => null,
			'teaching_format' => null,
			'teaching_level' => null,
			'annual_teaching_hours' => null,
			'start_date' => '04/2019',
			'end_date' => '07/2019',
			'description' => null,
			'document_proof_url' => null,
			'activities_info' => null,
			'achievements_info' => null,
			'materials_url' => null,
			'reference_info' => null,
			'type' => 'manager',
			'tags' => 'Foreign Language, Education, English',
		],
		[
			'user_id' => 1,
			'organization_name' => "JobsGO JSC",
			'organization_logo' => 'media/images/experience/jobsgologo.png',
			'organization_address' => 'Floor 3 Building G1, Five Star Garden, Thanh Xuan ward, Ha Noi city, Vietnam',
			'discipline' => 'Software Engineering',
			'country' => 'Vietnam',
			'position_title' => 'Backend Developer',
			'content' => "Google Sheet sync (Google API)@#Firebase notifications and messages (Firebase SDK, PHP, VueJS)@#Candidate info scrapper from files, sites (PdfToText, DomXpath, Curl, TesseractOCR)@#Job scrapper from sites (Curl, DomXpath)@#Matching data after scrapping@#Stringee call and logs (Stringee API & webhooks)@#GoCV@#Avatar cropper (JavaScript)@#Firebase Authen@#Realtime Dashboard 3C call center (Curl;Linkedin, Facebook lead ads scrapper)@#QR-code-related features@#Extract candidate data (AWS, OCR)@#Text, Face detection (AWS)@#Mailing template (Swift mail)@#Other private tools (JavaScript, JQuery, Curl, PHP libraries)",
			'course_info' => null,
			'teaching_format' => null,
			'teaching_level' => null,
			'annual_teaching_hours' => null,
			'start_date' => '07/2019',
			'end_date' => '09/2020',
			'description' => null,
			'document_proof_url' => null,
			'activities_info' => null,
			'achievements_info' => "Outstanding staff of the year@#Dec 2019",
			'materials_url' => null,
			'reference_info' => 'https://www.jobsgo.vn',
			'type' => 'developer',
			'tags' => 'PHP, Yii2 Advanced, JavaScript, AWS, Curl, Google API, Firebase, DomXPath, OCR, Swift Mail, Scrapper, Cropper, Stringee, VueJS',
		],
		[
			'user_id' => 1,
			'organization_name' => "HC Vina",
			'organization_logo' => 'media/images/experience/defaultlogo.png',
			'organization_address' => 'A36-TT10 Van Quan urban area, Van Quan ward, Ha Dong district, Ha Noi city, Vietnam',
			'discipline' => 'Language Education',
			'country' => 'Vietnam',
			'position_title' => 'Teacher',
			'content' => null,
			'course_info' => "English Grammar@#Maths",
			'teaching_format' => null,
			'teaching_level' => 'Secondary School, High School',
			'annual_teaching_hours' => 'English@#270;Maths@#50',
			'start_date' => '08/2020',
			'end_date' => '10/2021',
			'description' => null,
			'document_proof_url' => null,
			'activities_info' => null,
			'achievements_info' => null,
			'materials_url' => null,
			'reference_info' => null,
			'type' => 'teaching',
			'tags' => 'English, Maths',
		],
		[
			'user_id' => 1,
			'organization_name' => "T3H IT Institute",
			'organization_logo' => 'media/images/experience/t3hlogo.png',
			'organization_address' => '128a Ho Tung Mau street, Mai Dich ward, Cau Giay district, Ha Noi city, Vietnam',
			'discipline' => 'Software Engineering',
			'country' => 'Vietnam',
			'position_title' => 'Lecturer',
			'content' => null,
			'course_info' => "English in use (IELTS B1)@#Computer Skills (Office Word, Excel, PowerPoint, Presentation)@#Data Structure and Algorithms (Java)@#Software Development (PHP, Yii2 Advanced framework)@#Calculus@#Graph Theory",
			'teaching_format' => 'lecture',
			'teaching_level' => 'Graduate',
			'annual_teaching_hours' => 'English in use@#105;Computer Skills@#60;Data Structure and Algorithms@#45;Software Development@#120;Calculus@#45;Graph Theory@#45',
			'start_date' => '09/2020',
			'end_date' => '10/2021',
			'description' => null,
			'document_proof_url' => null,
			'activities_info' => null,
			'achievements_info' => null,
			'materials_url' => null,
			'reference_info' => null,
			'type' => 'teaching',
			'tags' => 'English, Maths, Calculus, PHP, Yii2 Advanced, Java, Office, Presentation, Graph',
		],
		[
			'user_id' => 1,
			'organization_name' => "College of Science and Technology",
			'organization_logo' => 'media/images/experience/cstlogo.png',
			'organization_address' => 'Ho Tung Mau street, Mai Dich ward, Cau Giay district, Ha Noi city, Vietnam',
			'discipline' => 'Software Engineering',
			'country' => 'Vietnam',
			'position_title' => 'Lecturer',
			'content' => null,
			'course_info' => "Web Development (PHP, Yii2 Advanced framework, Laravel framework)@#Java Web (Java core, Web fundamentals, Servlets and JSP, JDBC, MVC)@#Data Structure and Algorithms (C/C++)@#Calculus@#Graph Theory",
			'teaching_format' => 'lecture',
			'teaching_level' => 'Graduate',
			'annual_teaching_hours' => 'Web Development@#120;Java Web@#120;Data Structure and Algorithms@#60;Calculus@#45;Graph Theory@#45',
			'start_date' => '04/2021',
			'end_date' => '12/2024',
			'description' => null,
			'document_proof_url' => null,
			'activities_info' => null,
			'achievements_info' => null,
			'materials_url' => null,
			'reference_info' => null,
			'type' => 'teaching',
			'tags' => 'Maths, Calculus, PHP, Yii2 Advanced, Laravel, Java, Servlets, JSP, Graph',
		],
		[
			'user_id' => 1,
			'organization_name' => "VTI Academy",
			'organization_logo' => 'media/images/experience/vtilogo.png',
			'organization_address' => 'No. 19 Le Thanh Nghi street, Hai Ba Trung district, Ha Noi city, Vietnam',
			'discipline' => 'Software Engineering',
			'country' => 'Vietnam',
			'position_title' => 'Lecturer',
			'content' => null,
			'course_info' => "Web Development (HTML, CSS, Boostrap)@#Java Programming (Java core, MVC)@#Data Structure and Algorithms (Java)@#Graph Theory",
			'teaching_format' => 'lecture',
			'teaching_level' => 'Graduate',
			'annual_teaching_hours' => 'Web Development@#120;Java Programming@#120;Data Structure and Algorithms@#45;Graph Theory@#45',
			'start_date' => '10/2021',
			'end_date' => '09/2022',
			'description' => null,
			'document_proof_url' => null,
			'activities_info' => null,
			'achievements_info' => null,
			'materials_url' => null,
			'reference_info' => null,
			'type' => 'teaching',
			'tags' => 'Maths, Java, MVC, HTML, CSS, Bootstrap, Graph',
		],
		[
			'user_id' => 1,
			'organization_name' => "Hanoi University (HanU)",
			'organization_logo' => 'media/images/experience/hanulogo.png',
			'organization_address' => 'Km 9, Nguyen Trai street, Dai Mo ward, Ha Noi city, Vietnam',
			'discipline' => 'Software Engineering',
			'country' => 'Vietnam',
			'position_title' => 'Teaching Assistant',
			'content' => null,
			'course_info' => "WPR - Web Development (HTML, CSS, Boostrap)@#PR1 - Programming 01 (Java core, JavaFX)@#PR2 - Programming 02 (Java OOP, Swing, JavaFX)",
			'teaching_format' => 'lecture',
			'teaching_level' => 'Graduate',
			'annual_teaching_hours' => 'WPR@#Web Development@#30;PR1@#Programming 01@#45;PR2@#Programming 02@#45',
			'start_date' => '10/2021',
			'end_date' => '09/2022',
			'description' => null,
			'document_proof_url' => null,
			'activities_info' => null,
			'achievements_info' => null,
			'materials_url' => null,
			'reference_info' => null,
			'type' => 'teaching',
			'tags' => 'Java, OOP, MVC, HTML, CSS, Bootstrap, English',
		],
		[
			'user_id' => 1,
			'organization_name' => "CodeGym Academy",
			'organization_logo' => 'media/images/experience/codegymlogo.png',
			'organization_address' => 'No. TT01.23, Hai Dang city, My Dinh 2 ward, Nam Tu Liem district, Ha Noi city, Vietnam',
			'discipline' => 'Software Engineering',
			'country' => 'Vietnam',
			'position_title' => 'Lecturer',
			'content' => null,
			'course_info' => "PF2101R1 - Programming Fundamentals (JavaScript)@#RJ2203R1 - ReactJS (JSX, React, NextJS)@#BW2203R1 - Web Programming (HTML, CSS, Bootstrap)@#PYF2201R1 - Python Fundamentals (Jupiter Notebook, Matplotlib, Numpy, Pandas)",
			'teaching_format' => 'lecture',
			'teaching_level' => 'Graduate',
			'annual_teaching_hours' => 'PF2101R1@#Programming Fundamentals@#48;RJ2203R1@#ReactJS@#48;BW2203R1@#Web Programming@#48;PYF2201R1@#Python Fundamentals@#24',
			'start_date' => '08/2021',
			'end_date' => '12/2023',
			'description' => null,
			'document_proof_url' => null,
			'activities_info' => null,
			'achievements_info' => null,
			'materials_url' => null,
			'reference_info' => null,
			'type' => 'teaching',
			'tags' => 'JavaScript, OOP, MVC, HTML, CSS, Bootstrap, React, NextJS, Python',
		],
		[
			'user_id' => 1,
			'organization_name' => "Japan Advanced Institute of Science and Technology (JAIST)",
			'organization_logo' => 'media/images/experience/jaistlogo.png',
			'organization_address' => '1 Chome-1 Asahidai, Nomi, Ishikawa 923-1211, Japan',
			'discipline' => 'Software Engineering',
			'country' => 'Japan',
			'position_title' => 'Developer',
			'content' => "CyPROM Enhancedment (Python, OWASP Top Ten, Yii2 Advanced framework, National Vulnerability Database)@#Explainable NEC Script (PHP, Python, terminal scripts)",
			'course_info' => null,
			'teaching_format' => null,
			'teaching_level' => null,
			'annual_teaching_hours' => null,
			'start_date' => '10/2022',
			'end_date' => '10/2023',
			'description' => null,
			'document_proof_url' => 'https://github.com/cyb3rlab/CyPROM',
			'activities_info' => null,
			'achievements_info' => null,
			'materials_url' => null,
			'reference_info' => 'Assoc. Prof. Razvan Beuran@#https://www.jaist.ac.jp/~razvan/@# Japan Advanced Institute of Science and Technology (JAIST), in Ishikawa prefecture, Japan',
			'type' => 'developer',
			'tags' => 'JavaScript, PHP, Yii2 Advanced, Terminal Scripts, Python, Vulnerability, Cyber-security',
		],
		[
			'user_id' => 1,
			'organization_name' => "Hanoi Architectural University (HaU)",
			'organization_logo' => 'media/images/experience/haulogo.png',
			'organization_address' => 'Km 10 Nguyen Trai street, Thanh Xuan district, Hanoi city, Vietnam',
			'discipline' => 'Software Engineering',
			'country' => 'Vietnam',
			'position_title' => 'Visiting Lecturer',
			'content' => null,
			'course_info' => 'TH4309 - Web Technology (HTML, Bootstrap, PHP, Yii2 Advanced, Laravel)@#TH4316 - Java Technology (Java core, OOP, MVC)@#TH4311 - Mobile Programming (ReactJS, React Native, Android, iOS)',
			'teaching_format' => 'lecture',
			'teaching_level' => 'Graduate',
			'annual_teaching_hours' => 'TH4309@#Web Technology@#60;TH4316@#Java Technology@#60;TH4311@#Mobile Programming@#60',
			'start_date' => '09/2024',
			'end_date' => null,
			'description' => null,
			'document_proof_url' => null,
			'activities_info' => null,
			'achievements_info' => null,
			'materials_url' => null,
			'reference_info' => 'MSc. Hoang Thi Thuy Dung@#0967xxxxxx@# Hanoi Architectural University (HaU), Hanoi, Vietnam',
			'type' => 'teaching',
			'tags' => 'JavaScript, PHP, Yii2 Advanced, Laravel, React, React Native, Android, iOS',
		],
		[
			'user_id' => 1,
			'organization_name' => "Hanoi University (HanU)",
			'organization_logo' => 'media/images/experience/hanulogo.png',
			'organization_address' => 'Km 9, Nguyen Trai street, Dai Mo ward, Hanoi city, Vietnam',
			'discipline' => 'Software Engineering',
			'country' => 'Vietnam',
			'position_title' => 'Lecturer',
			'content' => null,
			'course_info' => 'PR1 - Programming 01 (Java core, GUI, Swing, AWT, JavaFX)@#PR2 - Programming 02 (Java OOP, MVC, GUI, Swing, AWT, JavaFX)@#SE1 - Software Engineering 01 (Spring Boot, Hibernate, Git)@#SE2 - Software Engineering 02 (Spring Boot, Hibernate, Git)@#WPR - Web Programming (HTML, JavaScript, React, NodeJS)@#MPR - Mobile Programming (React, React Native)@#JSD - Java Software Development (Java GUI, Threading, Meta-programming, I/O, Networking, JDBC)',
			'teaching_format' => 'lecture',
			'teaching_level' => 'Graduate',
			'annual_teaching_hours' => 'PR1@#Programming 01@#255;PR2@#Programming 02@#255;SE1@#Software Engineering 01@#60;SE2@#Software Engineering 02@#60;WPR@#Web Programming@#30;MPR@#Mobile Programming@#105;JSD@#Java Software Development@#105',
			'start_date' => '11/2023',
			'end_date' => null,
			'description' => null,
			'document_proof_url' => 'https://www.hanu.vn/a/75992/11-Khoa-Cong-nghe-thong-tin?c=8971',
			'activities_info' => "Undergraduate Thesis Reviewer@#2024;JST Alumni Meeting@#2024, 2025",
			'reference_info' => 'Dr. Trinh Bao Ngoc@#0987355xxx@#Vice Dean of Faculty of Information Technology, Hanoi University',
			'achievements_info' => null,
			'materials_url' => null,
			'type' => 'teaching',
			'tags' => 'Java, OOP, MVC, HTML, CSS, Bootstrap, PHP, Yii2 Advanced, React, React Native, Spring Boot, Hibernate, Swing, AWT, JavaFX, JavaScript, English, JST Alumni, Multi-threading, Meta-programming',
		],
		[
			'user_id' => 2,
			'organization_name' => "MindX Technology School",
			'organization_logo' => 'media/images/experience/mindxlogo.png',
			'organization_address' => '505 Minh Khai Street, Vinh Tuy ward, Ha Noi',
			'discipline' => 'Software Engineering',
			'country' => 'Vietnam',
			'position_title' => 'Lecturer',
			'content' => null,
			'course_info' => "Web Development (HTML5, CSS3, Javascript ES6)@#Robotic Programming (VexGo, VexIQ)@#Scratch Programming@#Scratch",
			'teaching_format' => 'lecture',
			'teaching_level' => 'Secondary School, High School',
			'annual_teaching_hours' => 'Web Development@#80;Robotic@#100;Scratch@#80',
			'start_date' => '08/2023',
			'end_date' => '04/2024',
			'description' => null,
			'document_proof_url' => null,
			'activities_info' => null,
			'achievements_info' => null,
			'materials_url' => null,
			'reference_info' => null,
			'type' => 'teaching',
			'tags' => 'HTML5, CSS3, Javascript ES6, VexGo, VexIQ, Scratch',
		],
		[
			'user_id' => 2,
			'organization_name' => "Hanoi University (HanU)",
			'organization_logo' => 'media/images/experience/hanulogo.png',
			'organization_address' => 'Km 9, Nguyen Trai street, Dai Mo ward, Hanoi, Vietnam',
			'discipline' => 'Software Engineering',
			'country' => 'Vietnam',
			'position_title' => 'Lecturer',
			'content' => null,
			'course_info' => "SAD - System Analysis and Design (SDLC, Agile, Waterfall, UX/UI, Usecase diagram, Sequence diagram, Figma)@#SS1 - Special Subject 1 (Game Theory, Stable Matching)",
			'teaching_format' => 'lecture',
			'teaching_level' => 'Graduate',
			'annual_teaching_hours' => 'SAD@#System Analysis and Design@#180;SS1@#Special Subject 1@#90',
			'start_date' => '09/2025',
			'end_date' => null,
			'description' => null,
			'document_proof_url' => 'https://www.hanu.vn/a/75992/11-Khoa-Cong-nghe-thong-tin?c=8971',
			'activities_info' => null,
			'achievements_info' => null,
			'materials_url' => null,
			'reference_info' => 'Dr. Trinh Bao Ngoc@#0987355xxx@#Vice Dean of Faculty of Information Technology, Hanoi University',
			'type' => 'teaching',
			'tags' => 'Agile, Waterfall, UX/UI, Figma, Game Theory, Stable Matching',
		],
	];

	private static function insertUserExperience()
	{
		$count = 0;
		foreach (self::$expInfo as $values) {
			$model = new UserExperience();
			$model->user_id = $values['user_id'];
			$model->organization_name = $values['organization_name'];
			$model->organization_logo = $values['organization_logo'];
			$model->organization_address = $values['organization_address'];
			$model->discipline = $values['discipline'];
			$model->country = $values['country'];
			$model->position_title = $values['position_title'];
			$model->course_info = $values['course_info'];
			$model->teaching_format = $values['teaching_format'];
			$model->teaching_level = $values['teaching_level'];
			$model->annual_teaching_hours = $values['annual_teaching_hours'];
			$model->start_date = $values['start_date'] !== null ? TimeHelper::normalizeDate($values['start_date'], 'd/m/Y') : null;
			$model->end_date = $values['end_date'] !== null ? TimeHelper::normalizeDate($values['end_date'], 'd/m/Y', true) : null;
			$model->description = $values['description'];
			$model->document_proof_url = $values['document_proof_url'];
			$model->activities_info = $values['activities_info'];
			$model->content = $values['content'];
			$model->achievements_info = $values['achievements_info'];
			$model->reference_info = $values['reference_info'];
			$model->materials_url = $values['materials_url'];
			$model->type = $values['type'];
			$model->tags = $values['tags'];
			$model->created_at = date('Y-m-d H:m:s');
			$model->updated_at = date('Y-m-d H:m:s');
			if ($model->save()) {
				$count++;
			} else {
				echo "Can not insert user experience: " . $model->organization_name . PHP_EOL;
				print_r($model->errors);
			}
		}
		echo "Inserted " . $count . '/' . count(self::$expInfo) . ' experiences.' . PHP_EOL;
	}

	private static $categoryInfo = [
		[
			'name' => 'Web Development',
			'parent_id' => 0,
			'description' => 'Project about website, web app, SaaS',
		],
		[
			'name' => 'Mobile App',
			'parent_id' => 0,
			'description' => 'Applications for iOS, Android, or cross-platform',
		],
		[
			'name' => 'Desktop Software',
			'parent_id' => 0,
			'description' => 'Software for Windows, macOS, Linux',
		],
		[
			'name' => 'AI',
			'parent_id' => 0,
			'description' => 'Projects related to AI, ML, or Data Science',
		],
		[
			'name' => 'IoT',
			'parent_id' => 0,
			'description' => 'Hardware, IoT devices, firmware, and embedded systems',
		],
		[
			'name' => 'Game Development',
			'parent_id' => 0,
			'description' => 'PC, console, or mobile game projects',
		],
		[
			'name' => 'Automation Tools',
			'parent_id' => 0,
			'description' => 'Scripts, automation tools, plugins, utilities',
		],
		[
			'name' => 'Blockchain',
			'parent_id' => 0,
			'description' => 'Blockchain, smart contracts, and crypto-related projects',
		],
		[
			'name' => 'AR VR Mixed Reality',
			'parent_id' => 0,
			'description' => 'Augmented reality, virtual reality, and mixed reality projects',
		],
		[
			'name' => 'Robotics',
			'parent_id' => 0,
			'description' => 'Robotics, control systems, drones',
		],
		[
			'name' => 'Machine Learning',
			'parent_id' => 4,
			'description' => 'Projects related to Machine Learning',
		],
		[
			'name' => 'Deep Learning',
			'parent_id' => 11,
			'description' => 'Projects related to Deep Learning',
		],
		[
			'name' => 'Computer Vision',
			'parent_id' => 12,
			'description' => 'Projects related to Computer Vision',
		],
	];

	/**
	 * @throws \yii\db\Exception
	 */
	private static function insertCategory()
	{
		$count = 0;
		foreach (self::$categoryInfo as $values) {
			$model = new Category();
			$model->name = trim($values['name']);
			$model->slug = StringHelper::toSlug(trim($values['name']));
			$model->parent_id = $values['parent_id'];
			$model->description = trim($values['description']);
			$model->created_at = date('Y-m-d H:m:s');
			$model->updated_at = date('Y-m-d H:m:s');
			if ($model->save()) {
				$count++;
			} else {
				echo "Can not insert category: " . $model->name . PHP_EOL;
				print_r($model->errors);
			}
		}
		echo "Inserted " . $count . '/' . count(self::$categoryInfo) . ' categories.' . PHP_EOL;
	}

	private static $projectInfo = [
		[
			'name' => 'I am a Developer',
			'description' => 'An application built by React Native that simulates the life of a developer from his/her born to his/her death',
			'image' => 'media/images/projects/mobile-application.png',
			'technologies' => 'React Native, Firebase',
			'price' => 800,
			'coin_price' => 5000,
			'currency_unit' => '2',
			'category_id' => 1,
			'views' => 9527,
			'rating_avg' => 4.5,
			'rating_count' => 86,
			'code_file' => null,
			'report_file' => null,
			'research_file' => null,
			'file_package' => null,
			'demo_url' => null,
			'download_policy' => 1,
			'download_count' => 108,
			'team_id' => '1,2',
			'published_at' => '19/08/2024',
			'user_id' => 1,
		],
		[
			'name' => 'I am a Developer 2',
			'description' => 'An application built by React Native that simulates the life of a developer from his/her born to his/her death',
			'image' => 'media/images/projects/mobile-application.png',
			'technologies' => 'Android, iOS',
			'price' => 700,
			'coin_price' => 4500,
			'currency_unit' => '2',
			'category_id' => 9,
			'views' => 9528,
			'rating_avg' => 4.9,
			'rating_count' => 86,
			'code_file' => null,
			'report_file' => null,
			'research_file' => null,
			'file_package' => null,
			'demo_url' => null,
			'download_policy' => 1,
			'download_count' => 108,
			'team_id' => '1,2',
			'published_at' => '19/09/2024',
			'user_id' => 1,
		],
		[
			'name' => 'I am a Developer 3',
			'description' => 'An application built by React Native that simulates the life of a developer from his/her born to his/her death',
			'image' => 'media/images/projects/mobile-application.png',
			'technologies' => 'Yii2 Advanced',
			'price' => 900,
			'coin_price' => 5500,
			'currency_unit' => '2',
			'category_id' => 1,
			'views' => 9500,
			'rating_avg' => 4.4,
			'rating_count' => 86,
			'code_file' => null,
			'report_file' => null,
			'research_file' => null,
			'file_package' => null,
			'demo_url' => null,
			'download_policy' => 1,
			'download_count' => 108,
			'team_id' => '1,2',
			'published_at' => '19/08/2025',
			'user_id' => 1,
		],
		[
			'name' => 'I am a Developer 4',
			'description' => 'An application built by React Native that simulates the life of a developer from his/her born to his/her death',
			'image' => 'media/images/projects/mobile-application.png',
			'technologies' => 'Spring Boot, Hibernate, NoSQL',
			'price' => 900,
			'coin_price' => 5000,
			'currency_unit' => '2',
			'category_id' => 1,
			'views' => 9530,
			'rating_avg' => 3.2,
			'rating_count' => 86,
			'code_file' => null,
			'report_file' => null,
			'research_file' => null,
			'file_package' => null,
			'demo_url' => null,
			'download_policy' => 1,
			'download_count' => 108,
			'team_id' => '1,2',
			'published_at' => '18/08/2024',
			'user_id' => 1,
		],
	];

	private static function insertProject()
	{
		$count = 0;
		foreach (self::$projectInfo as $values) {
			$model = new Project();
			$model->setAttributes($values);
			$model->slug = StringHelper::toSlug(trim($values['name']));
			$model->created_at = date('Y-m-d H:m:s');
			$model->updated_at = date('Y-m-d H:m:s');
			if ($model->save()) {
				$count++;
			} else {
				echo "Can not insert project: " . $model->name . PHP_EOL;
				print_r($model->errors);
			}
		}
		echo "Inserted " . $count . '/' . count(self::$projectInfo) . ' projects.' . PHP_EOL;
	}

	/**
	 * @throws Exception
	 */
	public static function importAllSampleData()
	{
		self::insertSampleRole();
		self::insertSampleUser();
		self::insertPublicationType();
		self::insertPublication();
		self::insertOrderStatus();
		self::insertTeam();
		self::insertPolicy();
		self::insertEducation();
		self::insertUserExperience();
		self::insertCategory();
		self::insertProject();
	}
}